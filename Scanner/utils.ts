import { Scanner } from "./Scanner.ts";
import { identifier, isAlpha } from "./terminals/identifier.ts";
import { isDigit, number } from "./terminals/number.ts";
import { string } from "./terminals/string.ts";
import { TokenType } from "./TokenType.ts";

export const scanToken = (scanner: Scanner) => {
  const c = scanner.advance();
  switch (c) {
    case "(":
      scanner.addToken(TokenType.LEFT_PAREN);
      break;
    case ")":
      scanner.addToken(TokenType.RIGHT_PAREN);
      break;
    case "{":
      scanner.addToken(TokenType.LEFT_BRACE);
      break;
    case "}":
      scanner.addToken(TokenType.RIGHT_BRACE);
      break;
    case ",":
      scanner.addToken(TokenType.COMMA);
      break;
    case ".":
      scanner.addToken(TokenType.DOT);
      break;
    case "-":
      scanner.addToken(TokenType.MINUS);
      break;
    case "+":
      scanner.addToken(TokenType.PLUS);
      break;
    case ";":
      scanner.addToken(TokenType.SEMICOLON);
      break;
    case "*":
      scanner.addToken(TokenType.STAR);
      break;
    case "!":
      scanner.addToken(
        scanner.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG
      );
      break;
    case "=":
      scanner.addToken(
        scanner.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
      );
      break;
    case "<":
      scanner.addToken(
        scanner.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS
      );
      break;
    case ">":
      scanner.addToken(
        scanner.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
      );
      break;
    case "/":
      if (scanner.match("/")) {
        while (scanner.peek() !== "\n" && !scanner.isAtEnd()) scanner.advance();
      } else {
        scanner.addToken(TokenType.SLASH);
      }
      break;
    case " ":
    case "\r":
    case "\t":
      break;
    case "\n":
      scanner.line++;
      break;
    case '"':
      string(scanner);
      break;
    default:
      if (isDigit(c)) {
        number(scanner);
      } else if (isAlpha(c)) {
        identifier(scanner);
      } else {
        console.error(`Line ${scanner.line}: Unexpected character.`);
      }
      break;
  }
};
