import { Parser } from "../../Parser/Parser.ts";
import { Stmt } from "../../Parser/Stmt.ts";
import { TokenType } from "../../Scanner/TokenType.ts";
import { declaration } from "../statement.parser.ts";

export const block = (parser: Parser): Stmt[] => {
  const statements: Stmt[] = [];
  while (!parser.check(TokenType.RIGHT_BRACE) && !parser.isAtEnd()) {
    const decl = declaration(parser);
    if (decl) {
      statements.push(decl);
    }
  }
  parser.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
  return statements;
};
