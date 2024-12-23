import { Interpreter } from "../../../Interpreter/Interpreter.ts";
import { RuntimeError } from "../../../Interpreter/RuntimeError.ts";
import { checkNumberOperands, isEqual } from "../../../Interpreter/utils.ts";
import { TokenType } from "../../../Scanner/TokenType.ts";
import { Binary } from "./binary.expression.ts";

export const interpretBinaryExpr = (
  expr: Binary,
  interpreter: Interpreter
): unknown => {
  const left = interpreter.evaluate(expr.left);
  const right = interpreter.evaluate(expr.right);

  const operator = expr.operator;

  switch (expr.operator.type) {
    case TokenType.GREATER:
      checkNumberOperands(operator, left, right);
      return (left as number) > (right as number);
    case TokenType.GREATER_EQUAL:
      checkNumberOperands(operator, left, right);
      return (left as number) >= (right as number);
    case TokenType.LESS:
      checkNumberOperands(operator, left, right);
      return (left as number) < (right as number);
    case TokenType.LESS_EQUAL:
      checkNumberOperands(operator, left, right);
      return (left as number) <= (right as number);
    case TokenType.BANG_EQUAL:
      return !isEqual(left, right);
    case TokenType.EQUAL_EQUAL:
      return isEqual(left, right);
    case TokenType.MINUS:
      checkNumberOperands(operator, left, right);
      return (left as number) - (right as number);
    case TokenType.PLUS:
      if (typeof left === "number" && typeof right === "number") {
        return left + right;
      }
      if (typeof left === "string" && typeof right === "string") {
        return left + right;
      }
      throw new RuntimeError(
        operator,
        "Operands must be two numbers or two strings."
      );
    case TokenType.SLASH:
      checkNumberOperands(operator, left, right);
      return (left as number) / (right as number);
    case TokenType.STAR:
      checkNumberOperands(operator, left, right);
      return (left as number) * (right as number);
  }

  // Unreachable
  throw new Error("Invalid binary operator.");
};
