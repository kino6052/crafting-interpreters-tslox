import { Function } from "./function.statement.ts";
import { LoxFunction } from "./LoxFunction.ts";
import { Interpreter } from "../../../Interpreter/Interpreter.ts";

export const interpretFunctionStmt = (
  stmt: Function,
  interpreter: Interpreter
) => {
  const func = new LoxFunction(stmt, interpreter.environment);
  interpreter.environment.define(stmt.name.lexeme, func);
};
