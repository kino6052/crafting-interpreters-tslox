import { readLines } from "https://deno.land/std@0.200.0/io/mod.ts";
import { Scanner } from "./Scanner.ts";

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

    for (const token of tokens) {
      console.log(token);
    }
  }

  static error(line: number, message: string): void {
    this.report(line, "", message);
  }

  private static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }
}
