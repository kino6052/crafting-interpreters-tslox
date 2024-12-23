import { Lox } from "../Lox.ts";
import { Token } from "../Scanner/Token.ts";
import { TokenType } from "../Scanner/TokenType.ts";
import { assignment } from "../expressions/binary/assignment/assignment.parser.ts";
import { block } from "../statements/block/block.parser.ts";
import { Block } from "../statements/block/block.statement.ts";
import { forStatement } from "../statements/for.parser.ts";
import { printStatement } from "../statements/print/print.parser.ts";
import { whileStatement } from "../statements/while/while.parser.ts";
import { Call, Expr, Grouping, Literal, Variable } from "./Expr.ts";
import { Expression, Function, If, Return, Stmt, Var } from "./Stmt.ts";

class ParseError extends Error {}

export class Parser {
  public tokens: Token[];
  public current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Stmt[] {
    const statements: Stmt[] = [];
    while (!this.isAtEnd()) {
      const decl = this.declaration();
      if (decl) {
        statements.push(decl);
      }
    }
    return statements;
  }

  public expression(): Expr {
    return assignment(this);
  }

  public declaration(): Stmt | null {
    try {
      if (this.match(TokenType.FUN)) {
        return this._function("function");
      }
      if (this.match(TokenType.VAR)) {
        return this.varDeclaration();
      }
      return this.statement();
    } catch (error) {
      if (error instanceof ParseError) {
        this.synchronize();
        return null;
      }
      throw error;
    }
  }

  public statement(): Stmt {
    if (this.match(TokenType.FOR)) return forStatement(this);
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.PRINT)) return printStatement(this);
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.WHILE)) return whileStatement(this);
    if (this.match(TokenType.LEFT_BRACE)) return new Block(block(this));

    return this.expressionStatement();
  }

  public ifStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

    const thenBranch = this.statement();
    let elseBranch: Stmt | null = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new If(condition, thenBranch, elseBranch);
  }

  public expressionStatement(): Expression {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new Expression(expr);
  }

  public _function(kind: string): Function {
    const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
    this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);

    const parameters: Token[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 parameters.");
        }
        parameters.push(
          this.consume(TokenType.IDENTIFIER, "Expect parameter name.")
        );
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
    this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);

    const body: Stmt[] = block(this);
    return new Function(name, parameters, body);
  }

  public returnStatement(): Return {
    const keyword = this.previous();
    let value: Expr | null = null;

    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");

    if (!value)
      throw new ParseError(
        "No expression to evaluate for the return statement"
      );

    return new Return(keyword, value);
  }

  public finishCall(callee: Expr): Call {
    const _arguments: Expr[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (_arguments.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 arguments.");
        }
        _arguments.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    const paren = this.consume(
      TokenType.RIGHT_PAREN,
      "Expect ')' after arguments."
    );

    return new Call(callee, paren, _arguments);
  }

  public call(): Expr {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  public varDeclaration(): Var {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
    let initializer: Expr | null = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");

    if (!initializer)
      throw new ParseError(`Invalid variable declaration of "${name}"`);
    return new Var(name, initializer);
  }

  public primary(): Expr {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Grouping(expr);
    }

    throw this.error(this.peek(), "Expect expression.");
  }

  public match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  public consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  public check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  public advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  public isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  public peek(): Token {
    return this.tokens[this.current];
  }

  public previous(): Token {
    return this.tokens[this.current - 1];
  }

  public error(token: Token, message: string): ParseError {
    Lox.error(token, message);
    return new ParseError();
  }

  public synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}
