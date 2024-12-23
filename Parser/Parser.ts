import { Lox } from "../Lox.ts";
import { Token } from "../Scanner/Token.ts";
import { TokenType } from "../Scanner/TokenType.ts";
import { declaration } from "../common/statements/statement.parser.ts";
import { ParseError } from "./ParseError.ts";
import { Stmt } from "./Stmt.ts";

export class Parser {
  public tokens: Token[];
  public current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Stmt[] {
    const statements: Stmt[] = [];
    while (!this.isAtEnd()) {
      const decl = declaration(this);
      if (decl) {
        statements.push(decl);
      }
    }
    return statements;
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
