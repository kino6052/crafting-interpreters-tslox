import { Expr } from "../../../../../../../../Parser/Expr.ts";
import { Parser } from "../../../../../../../../Parser/Parser.ts";
import { TokenType } from "../../../../../../../../Scanner/TokenType.ts";
import { Binary } from "../../../../../../binary.expression.ts";
import { factor } from "./factor/factor.parser.ts";

export const term = (parser: Parser): Expr => {
  let expr = factor(parser);

  while (parser.match(TokenType.MINUS, TokenType.PLUS)) {
    const operator = parser.previous();
    const right = factor(parser);
    expr = new Binary(expr, operator, right);
  }

  return expr;
};
