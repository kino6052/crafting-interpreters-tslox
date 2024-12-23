import { Interpreter } from "../../../../../Interpreter/Interpreter.ts";
import { Variable } from "./variable.expression.ts";

export const interpretVariableExpr = (
  expr: Variable,
  interpreter: Interpreter
) => interpreter.environment.get(expr.name);
