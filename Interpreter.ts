import {
  Assign,
  Binary,
  Call,
  Expr,
  Grouping,
  Literal,
  Logical,
  Unary,
  Variable,
  Visitor,
} from "./Expr.ts";
import {
  Block,
  Expression,
  If,
  Print,
  Stmt,
  Visitor as StmtVisitor,
  Var,
  While,
  Function,
  Return,
} from "./Stmt.ts";
import { Return as ReturnConstruct } from "./Return.ts";
import { Lox } from "./Lox.ts";
import { RuntimeError } from "./RuntimeError.ts";
import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import { Environment } from "./Environment.ts";
import { LoxFunction } from "./LoxFunction.ts";
import { LoxCallable } from "./LoxCallable.ts";

export class Interpreter implements Visitor<unknown>, StmtVisitor<void> {
  private globals: Environment = new Environment();
  private environment = this.globals;
  private locals: Map<Expr, number> = new Map();

  constructor() {
    this.globals.define("clock", {
      arity: () => 0,
      call: (interpreter: Interpreter, _arguments: unknown[]): unknown => {
        return Date.now() / 1000.0;
      },
      toString: () => "<native fn>",
    } satisfies LoxCallable);
  }

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

  visitFunctionStmt(stmt: Function): void {
    const func = new LoxFunction(stmt, this.environment);
    this.environment.define(stmt.name.lexeme, func);
  }

  visitReturnStmt(stmt: Return): void {
    let value: unknown = null;
    if (stmt.value !== null) {
      value = this.evaluate(stmt.value);
    }

    throw new ReturnConstruct(value);
  }

  visitCallExpr(expr: Call): unknown {
    const callee = this.evaluate(expr.callee);
    const _arguments: unknown[] = [];

    function isLoxCallable(object: unknown): object is LoxCallable {
      return (
        typeof object === "object" &&
        object !== null &&
        typeof (object as LoxCallable).call === "function" &&
        typeof (object as LoxCallable).arity === "function"
      );
    }

    for (const argument of expr.arguments) {
      _arguments.push(this.evaluate(argument));
    }

    if (!isLoxCallable(callee)) {
      throw new RuntimeError(
        expr.paren,
        "Can only call functions and classes."
      );
    }

    const func = callee as LoxCallable;

    if (_arguments.length !== func.arity()) {
      throw new RuntimeError(
        expr.paren,
        `Expected ${func.arity()} arguments but got ${_arguments.length}.`
      );
    }

    return func.call(this, _arguments);
  }

  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }

  visitLogicalExpr(expr: Logical): unknown {
    const left = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.OR) {
      if (this.isTruthy(left)) {
        return left;
      }
    } else {
      if (!this.isTruthy(left)) {
        return left;
      }
    }

    return this.evaluate(expr.right);
  }

  visitIfStmt(stmt: If): void {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }

  visitWhileStmt(stmt: While): void {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
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

  visitVariableExpr(expr: Variable): unknown {
    return this.lookUpVariable(expr.name, expr);
  }

  private lookUpVariable(name: Token, expr: Expr): unknown {
    const distance = this.locals.get(expr);
    if (distance !== undefined) {
      return this.environment.getAt(distance, name.lexeme);
    } else {
      return this.globals.get(name);
    }
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

  resolve(expr: Expr, depth: number): void {
    this.locals.set(expr, depth);
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

    const distance = this.locals.get(expr);
    if (distance !== undefined) {
      this.environment.assignAt(distance, expr.name, value);
    } else {
      this.globals.assign(expr.name, value);
    }

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
