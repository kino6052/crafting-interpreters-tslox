import { Expr } from "../../Parser/Expr.ts";
import { Stmt, Visitor } from "../../Parser/Stmt.ts";
import { Token } from "../../Scanner/Token.ts";

export class Var extends Stmt {
  readonly name: Token;
  readonly initializer: Expr;

  constructor(name: Token, initializer: Expr) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVarStmt(this);
  }
}
