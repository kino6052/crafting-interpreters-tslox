import { Expr } from "../../../../Parser/Expr.ts";
import { Parser } from "../../../../Parser/Parser.ts";
import { TokenType } from "../../../../Scanner/TokenType.ts";
import { expression } from "../../../expression.parser.ts";
import { Grouping } from "./grouping/grouping.expression.ts";
import { Literal } from "./literal/literal.expression.ts";
import { Variable } from "./variable/variable.expression.ts";

export const primary = (parser: Parser): Expr => {
  if (parser.match(TokenType.FALSE)) return new Literal(false);
  if (parser.match(TokenType.TRUE)) return new Literal(true);
  if (parser.match(TokenType.NIL)) return new Literal(null);

  if (parser.match(TokenType.NUMBER, TokenType.STRING)) {
    return new Literal(parser.previous().literal);
  }

  if (parser.match(TokenType.IDENTIFIER)) {
    return new Variable(parser.previous());
  }

  if (parser.match(TokenType.LEFT_PAREN)) {
    const expr = expression(parser);
    parser.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
    return new Grouping(expr);
  }

  throw parser.error(parser.peek(), "Expect expression.");
};
