import { Expr } from "../../Parser/Expr.ts";
import { Parser } from "../../Parser/Parser.ts";
import { TokenType } from "../../Scanner/TokenType.ts";
import { Unary } from "./unary.expression.ts";

export const unary = (parser: Parser): Expr => {
  if (parser.match(TokenType.BANG, TokenType.MINUS)) {
    const operator = parser.previous();
    const right = unary(parser);
    return new Unary(operator, right);
  }

  return parser.call();
};
