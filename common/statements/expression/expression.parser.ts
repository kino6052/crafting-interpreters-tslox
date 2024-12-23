import { expression } from "../../expressions/expression.parser.ts";
import { Parser } from "../../../Parser/Parser.ts";
import { TokenType } from "../../../Scanner/TokenType.ts";
import { Expression } from "./expression.statement.ts";

export const expressionStatement = (parser: Parser): Expression => {
  const expr = expression(parser);
  parser.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
  return new Expression(expr);
};
