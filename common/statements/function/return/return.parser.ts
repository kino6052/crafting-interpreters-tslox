import { expression } from "../../expressions/expression.parser.ts";
import { Expr } from "../../Parser/Expr.ts";
import { ParseError } from "../../Parser/ParseError.ts";
import { Parser } from "../../Parser/Parser.ts";
import { TokenType } from "../../Scanner/TokenType.ts";
import { Return } from "./return.statement.ts";

export const returnStatement = (parser: Parser): Return => {
  const keyword = parser.previous();
  let value: Expr | null = null;

  if (!parser.check(TokenType.SEMICOLON)) {
    value = expression(parser);
  }

  parser.consume(TokenType.SEMICOLON, "Expect ';' after return value.");

  if (!value)
    throw new ParseError("No expression to evaluate for the return statement");

  return new Return(keyword, value);
};
