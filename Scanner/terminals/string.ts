import { Scanner } from "../Scanner.ts";
import { TokenType } from "../TokenType.ts";

export const string = (scanner: Scanner) => {
  while (scanner.peek() !== '"' && !scanner.isAtEnd()) {
    if (scanner.peek() === "\n") scanner.line++;
    scanner.advance();
  }

  if (scanner.isAtEnd()) {
    console.error(`Line ${scanner.line}: Unterminated string.`);
    return;
  }

  scanner.advance();
  const value = scanner.source.substring(
    scanner.start + 1,
    scanner.current - 1
  );
  scanner.addToken(TokenType.STRING, value);
};
