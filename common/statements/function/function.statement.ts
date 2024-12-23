import { Stmt, Visitor } from "../../../Parser/Stmt.ts";
import { Token } from "../../../Scanner/Token.ts";

export class Function extends Stmt {
  readonly name: Token;
  readonly params: Array<Token>;
  readonly body: Array<Stmt>;

  constructor(name: Token, params: Array<Token>, body: Array<Stmt>) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitFunctionStmt(this);
  }
}
