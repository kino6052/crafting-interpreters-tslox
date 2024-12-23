import { Parser } from "../../Parser/Parser.ts";
import { Stmt } from "../../Parser/Stmt.ts";
import { TokenType } from "../../Scanner/TokenType.ts";
import { While } from "./while.statement.ts";

export const whileStatement = (parser: Parser): Stmt => {
  parser.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
  const condition = parser.expression();
  parser.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
  const body = parser.statement();

  return new While(condition, body);
};
