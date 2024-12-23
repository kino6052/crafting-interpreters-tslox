import { Expr } from "../../../../Parser/Expr.ts";
import { Stmt, Visitor } from "../../../../Parser/Stmt.ts";

export class While extends Stmt {
  readonly condition: Expr;
  readonly body: Stmt;

  constructor(condition: Expr, body: Stmt) {
    super();
    this.condition = condition;
    this.body = body;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitWhileStmt(this);
  }
}
