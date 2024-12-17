import { readLines } from "https://deno.land/std@0.200.0/io/mod.ts";
import { Scanner } from "./Scanner.ts";
import { Parser } from "./Parser.ts";
import { AstPrinter } from "./AstPrinter.ts";
import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";

export class Lox {
  private static hadError = false;

  static async runFile(path: string): Promise<void> {
    const decoder = new TextDecoder("utf-8");
    const bytes = await Deno.readFile(path);
    this.run(decoder.decode(bytes));

    if (this.hadError) Deno.exit(65);
  }

  static async runPrompt(): Promise<void> {
    console.log("Enter your code below (Ctrl+D to finish):");
    for await (const line of readLines(Deno.stdin)) {
      this.run(line);
      this.hadError = false;
    }
  }

  public static run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    const parser = new Parser(tokens);
    const expression = parser.parse();

    // Stop if there was a syntax error.
    if (this.hadError) return;

    if (expression) {
      console.warn(new AstPrinter().print(expression));
    }
  }

  static error(lineOrToken: number | Token, message: string): void {
    if (typeof lineOrToken === "number") {
      // Case where the first argument is a line number.
      this.report(lineOrToken, "", message);
    } else {
      // Case where the first argument is a Token.
      if (lineOrToken.type === TokenType.EOF) {
        this.report(lineOrToken.line, " at end", message);
      } else {
        this.report(lineOrToken.line, ` at '${lineOrToken.lexeme}'`, message);
      }
    }
  }

  private static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }
}
