import { Interpreter } from "../../../../Interpreter/Interpreter.ts";
import { LoxCallable } from "../../../../Interpreter/LoxCallable.ts";
import { RuntimeError } from "../../../../Interpreter/RuntimeError.ts";
import { Call } from "./call.expression.ts";

export const interpretCallExpr = (
  expr: Call,
  interpreter: Interpreter
): unknown => {
  const callee = interpreter.evaluate(expr.callee);
  const _arguments: unknown[] = [];

  function isLoxCallable(object: unknown): object is LoxCallable {
    return (
      typeof object === "object" &&
      object !== null &&
      typeof (object as LoxCallable).call === "function" &&
      typeof (object as LoxCallable).arity === "function"
    );
  }

  for (const argument of expr.arguments) {
    _arguments.push(interpreter.evaluate(argument));
  }

  if (!isLoxCallable(callee)) {
    throw new RuntimeError(expr.paren, "Can only call functions and classes.");
  }

  const func = callee as LoxCallable;

  if (_arguments.length !== func.arity()) {
    throw new RuntimeError(
      expr.paren,
      `Expected ${func.arity()} arguments but got ${_arguments.length}.`
    );
  }

  return func.call(interpreter, _arguments);
};
