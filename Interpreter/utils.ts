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
