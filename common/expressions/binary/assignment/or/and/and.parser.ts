import { Expr } from "../../../../../Parser/Expr.ts";
import { Parser } from "../../../../../Parser/Parser.ts";
import { TokenType } from "../../../../../Scanner/TokenType.ts";
import { Logical } from "../logical.expression.ts";
import { equality } from "./equality/equality.parser.ts";

export const and = (parser: Parser): Expr => {
  let expr = equality(parser);

  while (parser.match(TokenType.AND)) {
    const operator = parser.previous();
    const right = equality(parser);
    expr = new Logical(expr, operator, right);
  }

  return expr;
};
