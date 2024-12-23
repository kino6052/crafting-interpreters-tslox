import { Expr } from "../../../../../../Parser/Expr.ts";
import { Parser } from "../../../../../../Parser/Parser.ts";
import { TokenType } from "../../../../../../Scanner/TokenType.ts";
import { Binary } from "../../../../binary.expression.ts";
import { comparison } from "./comparison/comparison.parser.ts";

export const equality = (parser: Parser): Expr => {
  let expr = comparison(parser);

  while (parser.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
    const operator = parser.previous();
    const right = comparison(parser);
    expr = new Binary(expr, operator, right);
  }

  return expr;
};
