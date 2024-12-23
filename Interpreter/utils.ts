import { Token } from "../Scanner/Token.ts";
import { RuntimeError } from "./RuntimeError.ts";

export const isTruthy = (value: unknown): boolean => {
  if (value === null) return false;
  if (typeof value === "boolean") return value;
  return true;
};

export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a === b;
};

export const stringify = (value: unknown): string => {
  if (value === null) return "nil";

  if (typeof value === "number") {
    const text = value.toString();
    return text.endsWith(".0") ? text.slice(0, -2) : text;
  }

  return String(value);
};

export const checkNumberOperand = (operator: Token, operand: unknown): void => {
  if (typeof operand === "number") return;
  throw new RuntimeError(operator, "Operand must be a number.");
};

export const checkNumberOperands = (
  operator: Token,
  left: unknown,
  right: unknown
): void => {
  if (typeof left === "number" && typeof right === "number") return;
  throw new RuntimeError(operator, "Operands must be numbers.");
};
