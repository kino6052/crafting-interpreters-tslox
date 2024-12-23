import { Expr, Visitor } from "../../../../../../Parser/Expr.ts";

export class Literal extends Expr {
  readonly value: unknown;

  constructor(value: unknown) {
    super();
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}
