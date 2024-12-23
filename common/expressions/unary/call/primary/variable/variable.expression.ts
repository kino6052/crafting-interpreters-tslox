import { Expr, Visitor } from "../../../../../../Parser/Expr.ts";
import { Token } from "../../../../../../Scanner/Token.ts";

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
