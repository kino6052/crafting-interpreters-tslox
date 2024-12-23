import { expression } from "../../expressions/expression.parser.ts";
import { Expr } from "../../../Parser/Expr.ts";
import { ParseError } from "../../../Parser/ParseError.ts";
import { Parser } from "../../../Parser/Parser.ts";
import { TokenType } from "../../../Scanner/TokenType.ts";
import { Var } from "./var.statement.ts";

export const varDeclaration = (parser: Parser): Var => {
  const name = parser.consume(TokenType.IDENTIFIER, "Expect variable name.");
  let initializer: Expr | null = null;
  if (parser.match(TokenType.EQUAL)) {
    initializer = expression(parser);
  }
  parser.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");

  if (!initializer)
    throw new ParseError(`Invalid variable declaration of "${name}"`);
  return new Var(name, initializer);
};
