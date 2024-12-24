import { Lox } from "../Lox.ts";
import { Expr } from "../Parser/Expr.ts";
import { Stmt } from "../Parser/Stmt.ts";

import { Environment } from "./Environment.ts";
import { LoxCallable } from "./LoxCallable.ts";
import { RuntimeError } from "./RuntimeError.ts";
import { interpreterMap } from "./constants.ts";

export class Interpreter {
  public globals: Environment = new Environment();
  public environment = this.globals;

  constructor() {
    this.globals.define("clock", {
      arity: () => 0,
      call: (interpreter: Interpreter, _arguments: unknown[]): unknown => {
        return Date.now() / 1000.0;
      },
      toString: () => "<native fn>",
    } satisfies LoxCallable);
  }

  interpret(statements: Array<Stmt>): void {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        Lox.runtimeError(error);
      } else {
        throw error;
      }
    }
  }

  evaluate(expr: Expr): unknown {
    const fn = interpreterMap[expr.constructor.name];
    return fn?.(expr, this);
  }

  execute(stmt: Stmt): void {
    const fn = interpreterMap[stmt.constructor.name];
    fn?.(stmt, this);
  }
}
