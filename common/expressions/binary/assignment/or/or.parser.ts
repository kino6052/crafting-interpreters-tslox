import { Expr } from "../../../../../Parser/Expr.ts";
import { Parser } from "../../../../../Parser/Parser.ts";
import { TokenType } from "../../../../../Scanner/TokenType.ts";
import { and } from "./and/and.parser.ts";
import { Logical } from "./logical.expression.ts";

export const or = (parser: Parser): Expr => {
  let expr = and(parser);

  while (parser.match(TokenType.OR)) {
    const operator = parser.previous();
    const right = and(parser);
    expr = new Logical(expr, operator, right);
  }

  return expr;
};
