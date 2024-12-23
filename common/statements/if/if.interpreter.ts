import { Interpreter } from "../../../Interpreter/Interpreter.ts";
import { isTruthy } from "../../../Interpreter/utils.ts";
import { If } from "./if.statement.ts";

export const interpretIfStmt = (stmt: If, interpreter: Interpreter) => {
  if (isTruthy(interpreter.evaluate(stmt.condition))) {
    interpreter.execute(stmt.thenBranch);
  } else if (stmt.elseBranch !== null) {
    interpreter.execute(stmt.elseBranch);
  }
};
