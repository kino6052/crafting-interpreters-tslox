import { Interpreter } from "../../Interpreter/Interpreter.ts";
import { Var } from "./var.statement.ts";

export const interpretVarStmt = (stmt: Var, interpreter: Interpreter): void => {
  let value: unknown = null;
  if (stmt.initializer !== null) {
    value = interpreter.evaluate(stmt.initializer);
  }
  interpreter.environment.define(stmt.name.lexeme, value);
};
