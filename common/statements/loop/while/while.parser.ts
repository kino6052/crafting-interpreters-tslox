import { expression } from "../../../expressions/expression.parser.ts";
import { Parser } from "../../../../Parser/Parser.ts";
import { Stmt } from "../../../../Parser/Stmt.ts";
import { TokenType } from "../../../../Scanner/TokenType.ts";
import { statement } from "../../statement.parser.ts";
import { While } from "./while.statement.ts";

export const whileStatement = (parser: Parser): Stmt => {
  parser.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
  const condition = expression(parser);
  parser.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
  const body = statement(parser);

  return new While(condition, body);
};
