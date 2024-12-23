import { Expr } from "../../../Parser/Expr.ts";
import { Stmt, Visitor } from "../../../Parser/Stmt.ts";

export class If extends Stmt {
  readonly condition: Expr;
  readonly thenBranch: Stmt;
  readonly elseBranch: Stmt | null;

  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitIfStmt(this);
  }
}
