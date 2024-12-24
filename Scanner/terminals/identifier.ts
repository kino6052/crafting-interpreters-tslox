import { keywords } from "../constants.ts";
import { Scanner } from "../Scanner.ts";
import { TokenType } from "../TokenType.ts";
import { isDigit } from "./number.ts";

export const isAlpha = (c: string): boolean => {
  return /^[\p{L}_]+/u.test(c);
};

export const isAlphaNumeric = (c: string): boolean => {
  return isAlpha(c) || isDigit(c);
};

export const identifier = (scanner: Scanner) => {
  while (isAlphaNumeric(scanner.peek())) scanner.advance();
  const text = scanner.source.substring(scanner.start, scanner.current);
  const type = keywords[text] || TokenType.IDENTIFIER;
  scanner.addToken(type);
};
