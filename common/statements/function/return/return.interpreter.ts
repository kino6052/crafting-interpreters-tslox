import { Interpreter } from "../../Interpreter/Interpreter.ts";
import { Return } from "./return.statement.ts";
import { Return as ReturnConstruct } from "./Return.ts";

export const interpretReturnStmt = (stmt: Return, interpreter: Interpreter) => {
  let value: unknown = null;
  if (stmt.value !== null) {
    value = interpreter.evaluate(stmt.value);
  }

  throw new ReturnConstruct(value);
};
