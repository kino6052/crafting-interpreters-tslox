import { Stmt, Visitor } from "../../../Parser/Stmt.ts";

export class Block extends Stmt {
  readonly statements: Array<Stmt>;

  constructor(statements: Array<Stmt>) {
    super();
    this.statements = statements;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBlockStmt(this);
  }
}
