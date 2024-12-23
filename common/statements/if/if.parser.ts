import { expression } from "../../expressions/expression.parser.ts";
import { Parser } from "../../../Parser/Parser.ts";
import { Stmt } from "../../../Parser/Stmt.ts";
import { TokenType } from "../../../Scanner/TokenType.ts";
import { statement } from "../statement.parser.ts";
import { If } from "./if.statement.ts";

export const ifStatement = (parser: Parser): Stmt => {
  parser.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
  const condition = expression(parser);
  parser.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

  const thenBranch = statement(parser);
  let elseBranch: Stmt | null = null;
  if (parser.match(TokenType.ELSE)) {
    elseBranch = statement(parser);
  }

  return new If(condition, thenBranch, elseBranch);
};
