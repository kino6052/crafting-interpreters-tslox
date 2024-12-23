import { Scanner } from "../Scanner.ts";
import { TokenType } from "../TokenType.ts";

export const isDigit = (c: string): boolean => {
  return c >= "0" && c <= "9";
};

export const number = (scanner: Scanner) => {
  while (isDigit(scanner.peek())) scanner.advance();

  if (scanner.peek() === "." && isDigit(scanner.peekNext())) {
    scanner.advance();
    while (isDigit(scanner.peek())) scanner.advance();
  }

  scanner.addToken(
    TokenType.NUMBER,
    parseFloat(scanner.source.substring(scanner.start, scanner.current))
  );
};
