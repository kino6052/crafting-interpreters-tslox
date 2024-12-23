import { expression } from "../expressions/expression.parser.ts";
import { Literal } from "../expressions/unary/call/primary/literal/literal.expression.ts";
import { Expr } from "../Parser/Expr.ts";
import { Parser } from "../Parser/Parser.ts";
import { Stmt } from "../Parser/Stmt.ts";
import { TokenType } from "../Scanner/TokenType.ts";
import { Block } from "./block/block.statement.ts";
import { expressionStatement } from "./expression/expression.parser.ts";
import { Expression } from "./expression/expression.statement.ts";
import { statement } from "./statement.parser.ts";
import { varDeclaration } from "./var/var.parser.ts";
import { While } from "./while/while.statement.ts";

export const forStatement = (parser: Parser): Stmt => {
  parser.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

  let initializer: Stmt | null;
  if (parser.match(TokenType.SEMICOLON)) {
    initializer = null;
  } else if (parser.match(TokenType.VAR)) {
    initializer = varDeclaration(parser);
  } else {
    initializer = expressionStatement(parser);
  }

  let condition: Expr | null = null;
  if (!parser.check(TokenType.SEMICOLON)) {
    condition = expression(parser);
  }
  parser.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

  let increment: Expr | null = null;
  if (!parser.check(TokenType.RIGHT_PAREN)) {
    increment = expression(parser);
  }
  parser.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
  let body = statement(parser);

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
