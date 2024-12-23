import { Interpreter } from "../../Interpreter/Interpreter.ts";
import { checkNumberOperand, isTruthy } from "../../Interpreter/utils.ts";
import { TokenType } from "../../Scanner/TokenType.ts";
import { Unary } from "./unary.expression.ts";

export const interpretUnaryExpr = (
  expr: Unary,
  interpreter: Interpreter
): unknown => {
  const right = interpreter.evaluate(expr.right);
  const operator = expr.operator;

  switch (operator.type) {
    case TokenType.BANG:
      return !isTruthy(right);
    case TokenType.MINUS:
      checkNumberOperand(operator, right);
      return -(right as number);
  }

  // Unreachable
  throw new Error("Invalid unary operator.");
};
