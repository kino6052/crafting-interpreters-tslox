import {
  Assign,
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  Variable,
  Visitor,
} from "./Expr.ts";
import {
  Block,
  Expression,
  Print,
  Stmt,
  Visitor as StmtVisitor,
  Var,
} from "./Stmt.ts";
import { Lox } from "./Lox.ts";
import { RuntimeError } from "./RuntimeError.ts";
import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import { Environment } from "./Environment.ts";

export class Interpreter implements Visitor<unknown>, StmtVisitor<void> {
  private environment = new Environment();

  interpret(statements: Array<Stmt>): void {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        Lox.runtimeError(error);
      } else {
        throw error;
      }
    }
  }

  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }

  visitUnaryExpr(expr: Unary): unknown {
    const right = this.evaluate(expr.right);
    const operator = expr.operator;

    switch (operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        this.checkNumberOperand(operator, right);
        return -(right as number);
    }

    // Unreachable
    throw new Error("Invalid unary operator.");
  }

  public visitVariableExpr(expr: Variable): unknown {
    return this.environment.get(expr.name);
  }

  private checkNumberOperand(operator: Token, operand: unknown): void {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  private checkNumberOperands(
    operator: Token,
    left: unknown,
    right: unknown
  ): void {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  private isTruthy(value: unknown): boolean {
    if (value === null) return false;
    if (typeof value === "boolean") return value;
    return true;
  }

  private isEqual(a: unknown, b: unknown): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a === b;
  }

  private stringify(value: unknown): string {
    if (value === null) return "nil";

    if (typeof value === "number") {
      const text = value.toString();
      return text.endsWith(".0") ? text.slice(0, -2) : text;
    }

    return String(value);
  }

  visitGroupingExpr(expr: Grouping): unknown {
    return this.evaluate(expr.expression);
  }

  private evaluate(expr: Expr): unknown {
    return expr.accept(this);
  }

  private execute(stmt: Stmt): void {
    stmt.accept(this);
  }

  executeBlock(statements: Stmt[], environment: Environment): void {
    const previous = this.environment;
    try {
      this.environment = environment;

      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  visitBlockStmt(stmt: Block): void {
    this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  visitExpressionStmt(stmt: Expression): void {
    this.evaluate(stmt.expression);
  }

  visitPrintStmt(stmt: Print): void {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
  }

  visitVarStmt(stmt: Var): void {
    let value: unknown = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
  }

  visitAssignExpr(expr: Assign): unknown {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }

  visitBinaryExpr(expr: Binary): unknown {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    const operator = expr.operator;

    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(operator, left, right);
        return (left as number) > (right as number);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(operator, left, right);
        return (left as number) >= (right as number);
      case TokenType.LESS:
        this.checkNumberOperands(operator, left, right);
        return (left as number) < (right as number);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(operator, left, right);
        return (left as number) <= (right as number);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
      case TokenType.MINUS:
        this.checkNumberOperands(operator, left, right);
        return (left as number) - (right as number);
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        throw new RuntimeError(
          operator,
          "Operands must be two numbers or two strings."
        );
      case TokenType.SLASH:
        this.checkNumberOperands(operator, left, right);
        return (left as number) / (right as number);
      case TokenType.STAR:
        this.checkNumberOperands(operator, left, right);
        return (left as number) * (right as number);
    }

    // Unreachable
    throw new Error("Invalid binary operator.");
  }
}
