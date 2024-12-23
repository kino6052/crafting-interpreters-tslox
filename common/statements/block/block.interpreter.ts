import { Environment } from "../../../Interpreter/Environment.ts";
import { Interpreter } from "../../../Interpreter/Interpreter.ts";
import { Stmt } from "../../../Parser/Stmt.ts";
import { Block } from "./block.statement.ts";

export const executeBlock = (
  statements: Stmt[],
  environment: Environment,
  interpreter: Interpreter
): void => {
  const previous = interpreter.environment;
  try {
    interpreter.environment = environment;

    for (const statement of statements) {
      interpreter.execute(statement);
    }
  } finally {
    interpreter.environment = previous;
  }
};

export const interpretBlockStmt = (
  stmt: Block,
  interpreter: Interpreter
): void => {
  executeBlock(
    stmt.statements,
    new Environment(interpreter.environment),
    interpreter
  );
};
