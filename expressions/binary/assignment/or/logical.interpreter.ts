import { Interpreter } from "../../../../Interpreter/Interpreter.ts";
import { isTruthy } from "../../../../Interpreter/utils.ts";
import { TokenType } from "../../../../Scanner/TokenType.ts";
import { Logical } from "./logical.expression.ts";

export const interpretLogicalExpr = (
  expr: Logical,
  interpreter: Interpreter
): unknown => {
  const left = interpreter.evaluate(expr.left);

  if (expr.operator.type === TokenType.OR) {
    if (isTruthy(left)) {
      return left;
    }
  } else {
    if (!isTruthy(left)) {
      return left;
    }
  }

  return interpreter.evaluate(expr.right);
};
