// This file is auto-generated.
import { Return } from "../common/statements/function/return/return.statement.ts";
import { Block } from "../common/statements/block/block.statement.ts";
import { Expression } from "../common/statements/expression/expression.statement.ts";
import { Function } from "../common/statements/function/function.statement.ts";
import { If } from "../common/statements/if/if.statement.ts";
import { Print } from "../common/statements/print/print.statement.ts";
import { Var } from "../common/statements/var/var.statement.ts";
import { While } from "../common/statements/loop/while/while.statement.ts";

// TODO: Make a simple map
export interface Visitor<R> {
  visitBlockStmt(stmt: Block): R;
  visitExpressionStmt(stmt: Expression): R;
  visitFunctionStmt(stmt: Function): R;
  visitIfStmt(stmt: If): R;
  visitPrintStmt(stmt: Print): R;
  visitReturnStmt(stmt: Return): R;
  visitVarStmt(stmt: Var): R;
  visitWhileStmt(stmt: While): R;
}
export abstract class Stmt {
  abstract accept<R>(visitor: Visitor<R>): R;
}
