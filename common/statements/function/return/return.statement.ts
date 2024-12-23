import { Expr } from "../../../../Parser/Expr.ts";
import { Stmt, Visitor } from "../../../../Parser/Stmt.ts";
import { Token } from "../../../../Scanner/Token.ts";

export class Return extends Stmt {
  readonly keyword: Token;
  readonly value: Expr;

  constructor(keyword: Token, value: Expr) {
    super();
    this.keyword = keyword;
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitReturnStmt(this);
  }
}
