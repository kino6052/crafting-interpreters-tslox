import { Expr } from "../../../../../../../../Parser/Expr.ts";
import { Parser } from "../../../../../../../../Parser/Parser.ts";
import { TokenType } from "../../../../../../../../Scanner/TokenType.ts";
import { Binary } from "../../../../../binary.expression.ts";
import { term } from "./term/term.parser.ts";

export const comparison = (parser: Parser): Expr => {
  let expr = term(parser);

  while (
    parser.match(
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
      TokenType.LESS,
      TokenType.LESS_EQUAL
    )
  ) {
    const operator = parser.previous();
    const right = term(parser);
    expr = new Binary(expr, operator, right);
  }

  return expr;
};
