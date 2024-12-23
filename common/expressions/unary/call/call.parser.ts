import { Expr } from "../../../Parser/Expr.ts";
import { Parser } from "../../../Parser/Parser.ts";
import { TokenType } from "../../../Scanner/TokenType.ts";
import { expression } from "../../expression.parser.ts";
import { Call } from "./call.expression.ts";
import { primary } from "./primary/primary.parser.ts";

export const finishCall = (callee: Expr, parser: Parser): Call => {
  const _arguments: Expr[] = [];

  if (!parser.check(TokenType.RIGHT_PAREN)) {
    do {
      if (_arguments.length >= 255) {
        parser.error(parser.peek(), "Can't have more than 255 arguments.");
      }
      _arguments.push(expression(parser));
    } while (parser.match(TokenType.COMMA));
  }

  const paren = parser.consume(
    TokenType.RIGHT_PAREN,
    "Expect ')' after arguments."
  );

  return new Call(callee, paren, _arguments);
};

export const call = (parser: Parser): Expr => {
  let expr = primary(parser);

  while (true) {
    if (parser.match(TokenType.LEFT_PAREN)) {
      expr = finishCall(expr, parser);
    } else {
      break;
    }
  }

  return expr;
};
