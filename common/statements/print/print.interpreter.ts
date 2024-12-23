import { Interpreter } from "../../Interpreter/Interpreter.ts";
import { stringify } from "../../Interpreter/utils.ts";
import { Print } from "./print.statement.ts";

export const interpretPrintStmt = (
  stmt: Print,
  interpreter: Interpreter
): void => {
  const value = interpreter.evaluate(stmt.expression);
  console.log(stringify(value));
};
