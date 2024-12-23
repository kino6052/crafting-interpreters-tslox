import { Expr } from "../../../../../../../../../../Parser/Expr.ts";
import { Parser } from "../../../../../../../../../../Parser/Parser.ts";
import { TokenType } from "../../../../../../../../../../Scanner/TokenType.ts";
import { unary } from "../../../../../../../../unary/unary.parser.ts";
import { Binary } from "../../../../../../../binary.expression.ts";

export const factor = (parser: Parser): Expr => {
  let expr = unary(parser);

  while (parser.match(TokenType.SLASH, TokenType.STAR)) {
    const operator = parser.previous();
    const right = unary(parser);
    expr = new Binary(expr, operator, right);
  }

  return expr;
};
