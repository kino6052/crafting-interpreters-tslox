import { Binary } from "../expressions/binary/binary.expression.ts";
import { Expr, Grouping, Literal, Unary, Visitor } from "../Parser/Expr.ts";

export class AstPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr: Literal): string {
    return expr.value?.toString() ?? "nil";
  }

  visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    const parts = exprs.map((expr) => expr.accept(this));
    return `(${name} ${parts.join(" ")})`;
  }
}
