import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import { scanToken } from "./utils.ts";

export class Scanner {
  public source: string;
  public tokens: Token[] = [];
  public start: number = 0;
  public current: number = 0;
  public line: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      scanToken(this);
    }

    this.tokens.push({
      type: TokenType.EOF,
      lexeme: "",
      literal: null,
      line: this.line,
    });

    return this.tokens;
  }

  public match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  public peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  public peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  public isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  public advance(): string {
    return this.source.charAt(this.current++);
  }

  public addToken(type: TokenType, literal: unknown = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push({ type, lexeme: text, literal, line: this.line });
  }
}
