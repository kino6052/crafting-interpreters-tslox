import { Token } from "./Token.ts";

export class RuntimeError extends Error {
  readonly token: Token;

  constructor(token: Token, message: string) {
    super(message); // Call the parent class (Error) constructor with the message
    this.token = token;
    this.name = "RuntimeError"; // Set the error name explicitly
  }
}
