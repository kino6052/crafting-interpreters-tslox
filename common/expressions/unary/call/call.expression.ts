import { Expr, Visitor } from "../../../../Parser/Expr.ts";
import { Token } from "../../../../Scanner/Token.ts";

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
