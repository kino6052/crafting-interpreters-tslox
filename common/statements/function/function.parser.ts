import { Parser } from "../../Parser/Parser.ts";
import { Stmt } from "../../Parser/Stmt.ts";
import { Token } from "../../Scanner/Token.ts";
import { TokenType } from "../../Scanner/TokenType.ts";
import { block } from "../block/block.parser.ts";
import { Function } from "./function.statement.ts";

export const _function = (kind: string, parser: Parser): Function => {
  const name = parser.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
  parser.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);

  const parameters: Token[] = [];
  if (!parser.check(TokenType.RIGHT_PAREN)) {
    do {
      if (parameters.length >= 255) {
        parser.error(parser.peek(), "Can't have more than 255 parameters.");
      }
      parameters.push(
        parser.consume(TokenType.IDENTIFIER, "Expect parameter name.")
      );
    } while (parser.match(TokenType.COMMA));
  }

  parser.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
  parser.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);

  const body: Stmt[] = block(parser);
  return new Function(name, parameters, body);
};
