// This file is auto-generated.
import { Return } from "../statements/return/return.statement.ts";
import { Block } from "../statements/block/block.statement.ts";
import { Expression } from "../statements/expression/expression.statement.ts";
import { Function } from "../statements/function/function.statement.ts";
import { If } from "../statements/if/if.statement.ts";
import { Print } from "../statements/print/print.statement.ts";
import { Var } from "../statements/var/var.statement.ts";
import { While } from "../statements/while/while.statement.ts";

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
