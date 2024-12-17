import { readLines } from "https://deno.land/std@0.200.0/io/mod.ts";
import { Interpreter } from "./Interpreter.ts";
import { Parser } from "./Parser.ts";
import { Scanner } from "./Scanner.ts";
import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import { RuntimeError } from "./RuntimeError.ts";

export class Lox {
  private static interpreter = new Interpreter();
  private static hadError = false;
  private static hadRuntimeError = false;

  static async runFile(path: string): Promise<void> {
    const decoder = new TextDecoder("utf-8");
    const bytes = await Deno.readFile(path);
    this.run(decoder.decode(bytes));

    if (this.hadError) Deno.exit(65);
    if (this.hadRuntimeError) Deno.exit(70);
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
    const statements = parser.parse();

    // Stop if there was a syntax error.
    if (this.hadError) return;

    if (statements) {
      Lox.interpreter.interpret(statements);
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

  static runtimeError(error: RuntimeError): void {
    console.error(`${error.message}\n[line ${error.token.line}]`);
    this.hadRuntimeError = true;
  }

  private static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }
}
