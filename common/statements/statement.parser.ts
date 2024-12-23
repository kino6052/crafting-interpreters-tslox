import { ParseError } from "../Parser/ParseError.ts";
import { Parser } from "../Parser/Parser.ts";
import { Stmt } from "../Parser/Stmt.ts";
import { TokenType } from "../Scanner/TokenType.ts";
import { block } from "./block/block.parser.ts";
import { Block } from "./block/block.statement.ts";
import { expressionStatement } from "./expression/expression.parser.ts";
import { forStatement } from "./for.parser.ts";
import { _function } from "./function/function.parser.ts";
import { ifStatement } from "./if/if.parser.ts";
import { printStatement } from "./print/print.parser.ts";
import { returnStatement } from "./return/return.parser.ts";
import { varDeclaration } from "./var/var.parser.ts";
import { whileStatement } from "./while/while.parser.ts";

export const statement = (parser: Parser): Stmt => {
  if (parser.match(TokenType.FOR)) return forStatement(parser);
  if (parser.match(TokenType.IF)) return ifStatement(parser);
  if (parser.match(TokenType.PRINT)) return printStatement(parser);
  if (parser.match(TokenType.RETURN)) return returnStatement(parser);
  if (parser.match(TokenType.WHILE)) return whileStatement(parser);
  if (parser.match(TokenType.LEFT_BRACE)) return new Block(block(parser));

  return expressionStatement(parser);
};

export const declaration = (parser: Parser): Stmt | null => {
  try {
    if (parser.match(TokenType.FUN)) {
      return _function("function", parser);
    }
    if (parser.match(TokenType.VAR)) {
      return varDeclaration(parser);
    }
    return statement(parser);
  } catch (error) {
    if (error instanceof ParseError) {
      parser.synchronize();
      return null;
    }
    throw error;
  }
};
