import { Environment } from "./Environment.ts";
import { Interpreter } from "./Interpreter.ts";
import { LoxCallable } from "./LoxCallable.ts";
import { Return } from "./Return.ts";
import { Function } from "./Stmt.ts";

export class LoxFunction implements LoxCallable {
  private declaration: Function;
  private closure: Environment;

  constructor(declaration: Function, closure: Environment) {
    this.declaration = declaration;
    this.closure = closure;
  }

  call(interpreter: Interpreter, _arguments: unknown[]): unknown {
    const environment = new Environment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, _arguments[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      if (returnValue instanceof Return) {
        return returnValue.value;
      }
      throw returnValue; // Re-throw in case it's not a 'Return' exception
    }

    return null;
  }

  arity(): number {
    return this.declaration.params.length;
  }

  toString(): string {
    return `<fn ${this.declaration.name.lexeme}>`;
  }
}
