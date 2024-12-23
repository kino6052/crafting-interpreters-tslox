import { Environment } from "../../../Interpreter/Environment.ts";
import { Interpreter } from "../../../Interpreter/Interpreter.ts";
import { LoxCallable } from "../../../Interpreter/LoxCallable.ts";
import { Return } from "./return/Return.ts";
import { executeBlock } from "../block/block.interpreter.ts";
import { Function } from "./function.statement.ts";

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
      executeBlock(this.declaration.body, environment, interpreter);
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
