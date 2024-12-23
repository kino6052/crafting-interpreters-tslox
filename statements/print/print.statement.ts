import { Expr } from "../../Parser/Expr.ts";
import { Stmt, Visitor } from "../../Parser/Stmt.ts";

export class Print extends Stmt {
  readonly expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitPrintStmt(this);
  }
}
