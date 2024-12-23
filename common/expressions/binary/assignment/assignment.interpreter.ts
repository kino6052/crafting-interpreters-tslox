import { Interpreter } from "../../../../Interpreter/Interpreter.ts";
import { Assign } from "./assignment.expression.ts";

export const interpretAssignmentExpr = (
  expr: Assign,
  interpreter: Interpreter
) => {
  const value = interpreter.evaluate(expr.value);
  interpreter.environment.assign(expr.name, value);
  return value;
};
