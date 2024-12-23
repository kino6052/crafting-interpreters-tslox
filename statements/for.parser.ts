import { Expr, Literal } from "../Parser/Expr.ts";
import { Parser } from "../Parser/Parser.ts";
import { Expression, Stmt } from "../Parser/Stmt.ts";
import { TokenType } from "../Scanner/TokenType.ts";
import { Block } from "./block/block.statement.ts";
import { While } from "./while/while.statement.ts";

export const forStatement = (parser: Parser): Stmt => {
  parser.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

  let initializer: Stmt | null;
  if (parser.match(TokenType.SEMICOLON)) {
    initializer = null;
  } else if (parser.match(TokenType.VAR)) {
    initializer = parser.varDeclaration();
  } else {
    initializer = parser.expressionStatement();
  }

  let condition: Expr | null = null;
  if (!parser.check(TokenType.SEMICOLON)) {
    condition = parser.expression();
  }
  parser.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

  let increment: Expr | null = null;
  if (!parser.check(TokenType.RIGHT_PAREN)) {
    increment = parser.expression();
  }
  parser.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
  let body = parser.statement();

  if (increment !== null) {
    body = new Block([body, new Expression(increment)]);
  }

  if (condition === null) condition = new Literal(true);
  body = new While(condition, body);

  if (initializer !== null) {
    body = new Block([initializer, body]);
  }

  return body;
};
