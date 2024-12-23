import { Parser } from "../../Parser/Parser.ts";
import { TokenType } from "../../Scanner/TokenType.ts";
import { Print } from "./print.statement.ts";

export const printStatement = (parser: Parser): Print => {
  const value = parser.expression();
  parser.consume(TokenType.SEMICOLON, "Expect ';' after value.");
  return new Print(value);
};
