// This file is auto-generated.
import { Assign } from "../expressions/binary/assignment/assignment.expression.ts";
import { Logical } from "../expressions/binary/assignment/or/logical.expression.ts";
import { Binary } from "../expressions/binary/binary.expression.ts";
import { Call } from "../expressions/unary/call/call.expression.ts";
import { Grouping } from "../expressions/unary/call/primary/grouping/grouping.expression.ts";
import { Literal } from "../expressions/unary/call/primary/literal/literal.expression.ts";
import { Variable } from "../expressions/unary/call/primary/variable/variable.expression.ts";
import { Unary } from "../expressions/unary/unary.expression.ts";

// TODO: Make a simple map
export interface Visitor<R> {
  visitAssignExpr(expr: Assign): R;
  visitBinaryExpr(expr: Binary): R;
  visitCallExpr(expr: Call): R;
  visitGroupingExpr(expr: Grouping): R;
  visitLiteralExpr(expr: Literal): R;
  visitLogicalExpr(expr: Logical): R;
  visitUnaryExpr(expr: Unary): R;
  visitVariableExpr(expr: Variable): R;
}
export abstract class Expr {
  abstract accept<R>(visitor: Visitor<R>): R;
}
