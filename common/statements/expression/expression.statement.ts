import { Expr } from "../../Parser/Expr.ts";
import { Stmt, Visitor } from "../../Parser/Stmt.ts";

export class Expression extends Stmt {
  readonly expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}
