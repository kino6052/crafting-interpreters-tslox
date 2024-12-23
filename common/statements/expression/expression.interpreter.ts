import { Interpreter } from "../../../Interpreter/Interpreter.ts";
import { Expression } from "./expression.statement.ts";

export const interpretExpressionStmt = (
  stmt: Expression,
  interpreter: Interpreter
): void => {
  interpreter.evaluate(stmt.expression);
};
