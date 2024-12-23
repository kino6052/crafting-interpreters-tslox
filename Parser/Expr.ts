// This file is auto-generated.
import { Token } from "../Scanner/Token.ts";
import { Assign } from "../expressions/binary/assignment/assignment.expression.ts";
import { Logical } from "../expressions/binary/assignment/or/logical.expression.ts";
import { Binary } from "../expressions/binary/binary.expression.ts";
import { Unary } from "../expressions/unary/unary.expression.ts";

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

export class Call extends Expr {
  readonly callee: Expr;
  readonly paren: Token;
  readonly arguments: Array<Expr>;

  constructor(callee: Expr, paren: Token, _arguments: Array<Expr>) {
    super();
    this.callee = callee;
    this.paren = paren;
    this.arguments = _arguments;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitCallExpr(this);
  }
}

export class Grouping extends Expr {
  readonly expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}

export class Literal extends Expr {
  readonly value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export class Variable extends Expr {
  readonly name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVariableExpr(this);
  }
}
