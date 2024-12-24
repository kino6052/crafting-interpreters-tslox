import { interpretAssignmentExpr } from "../common/expressions/binary/assignment/assignment.interpreter.ts";
import { interpretLogicalExpr } from "../common/expressions/binary/assignment/or/logical.interpreter.ts";
import { interpretBinaryExpr } from "../common/expressions/binary/binary.interpreter.ts";
import { interpretCallExpr } from "../common/expressions/unary/call/call.interpreter.ts";
import { interpretGroupingExpr } from "../common/expressions/unary/call/primary/grouping/grouping.interpreter.ts";
import { interpretLiteral } from "../common/expressions/unary/call/primary/literal/literal.interpreter.ts";
import { interpretVariableExpr } from "../common/expressions/unary/call/primary/variable/variable.interpreter.ts";
import { interpretUnaryExpr } from "../common/expressions/unary/unary.interpreter.ts";
import { interpretBlockStmt } from "../common/statements/block/block.interpreter.ts";
import { interpretExpressionStmt } from "../common/statements/expression/expression.interpreter.ts";
import { interpretFunctionStmt } from "../common/statements/function/function.interpreter.ts";
import { interpretReturnStmt } from "../common/statements/function/return/return.interpreter.ts";
import { interpretIfStmt } from "../common/statements/if/if.interpreter.ts";
import { interpretWhileStmt } from "../common/statements/loop/while/while.interpreter.ts";
import { interpretPrintStmt } from "../common/statements/print/print.interpreter.ts";
import { interpretVarStmt } from "../common/statements/var/var.interpreter.ts";
import { Interpreter } from "./Interpreter.ts";

export const interpreterMap: Record<
  string,
  (entity: any, interpreter: Interpreter) => unknown
> = {
  Binary: interpretBinaryExpr,
  Block: interpretBlockStmt,
  Function: interpretFunctionStmt,
  Return: interpretReturnStmt,
  Call: interpretCallExpr,
  Literal: interpretLiteral,
  Logical: interpretLogicalExpr,
  If: interpretIfStmt,
  While: interpretWhileStmt,
  Unary: interpretUnaryExpr,
  Variable: interpretVariableExpr,
  Grouping: interpretGroupingExpr,
  Expression: interpretExpressionStmt,
  Print: interpretPrintStmt,
  Var: interpretVarStmt,
  Assign: interpretAssignmentExpr,
};
