import { Interpreter } from "../../../../../Interpreter/Interpreter.ts";
import { Grouping } from "./grouping.expression.ts";

export const interpretGroupingExpr = (
  expr: Grouping,
  interpreter: Interpreter
): unknown => {
  return interpreter.evaluate(expr.expression);
};
