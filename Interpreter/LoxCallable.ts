import { Interpreter } from "./Interpreter.ts";

export interface LoxCallable {
  call(interpreter: Interpreter, _arguments: unknown[]): unknown;
  arity(): number;
  toString(): string;
}
