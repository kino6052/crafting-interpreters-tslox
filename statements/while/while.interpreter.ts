import { Interpreter } from "../../Interpreter/Interpreter.ts";
import { isTruthy } from "../../Interpreter/utils.ts";
import { While } from "./while.statement.ts";

export const interpretWhileStmt = (
  stmt: While,
  interpreter: Interpreter
): void => {
  while (isTruthy(interpreter.evaluate(stmt.condition))) {
    interpreter.execute(stmt.body);
  }
};
