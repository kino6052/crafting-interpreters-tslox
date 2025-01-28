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
} from "./Expr.ts";
import {
  Block,
  Expression,
  If,
  Print,
  Return,
  Stmt,
  Var,
  While,
  Function as _Function,
} from "./Stmt.ts";
import { Token } from "./Token.ts";
import { Interpreter } from "./Interpreter.ts";
import { Lox } from "./Lox.ts";

enum FunctionType {
  NONE,
  FUNCTION,
}

export class Resolver implements Expr.Visitor<void>, Stmt.Visitor<void> {
  private readonly interpreter: Interpreter;
  private readonly scopes: Map<string, boolean>[] = [];
  private currentFunction: FunctionType = FunctionType.NONE;

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
  }

  resolve(statements: Stmt[]): void {
    for (const statement of statements) {
      this.resolveStmt(statement);
    }
  }

  visitBlockStmt(stmt: Block): void {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
  }

  visitExpressionStmt(stmt: Expression): void {
    this.resolveExpr(stmt.expression);
  }

  visitFunctionStmt(stmt: _Function): void {
    this.declare(stmt.name);
    this.define(stmt.name);

    this.resolveFunction(stmt, FunctionType.FUNCTION);
  }

  visitIfStmt(stmt: If): void {
    this.resolveExpr(stmt.condition);
    this.resolveStmt(stmt.thenBranch);
    if (stmt.elseBranch !== null) {
      this.resolveStmt(stmt.elseBranch);
    }
  }

  visitPrintStmt(stmt: Print): void {
    this.resolveExpr(stmt.expression);
  }

  visitReturnStmt(stmt: Return): void {
    if (this.currentFunction === FunctionType.NONE) {
      Lox.error(stmt.keyword, "Can't return from top-level code.");
    }

    if (stmt.value !== null) {
      this.resolveExpr(stmt.value);
    }
  }

  visitVarStmt(stmt: Var): void {
    this.declare(stmt.name);
    if (stmt.initializer !== null) {
      this.resolveExpr(stmt.initializer);
    }
    this.define(stmt.name);
  }

  visitWhileStmt(stmt: While): void {
    this.resolveExpr(stmt.condition);
    this.resolveStmt(stmt.body);
  }

  visitAssignExpr(expr: Assign): void {
    this.resolveExpr(expr.value);
    this.resolveLocal(expr, expr.name);
  }

  visitBinaryExpr(expr: Binary): void {
    this.resolveExpr(expr.left);
    this.resolveExpr(expr.right);
  }

  visitCallExpr(expr: Call): void {
    this.resolveExpr(expr.callee);

    for (const argument of expr.arguments) {
      this.resolveExpr(argument);
    }
  }

  visitGroupingExpr(expr: Grouping): void {
    this.resolveExpr(expr.expression);
  }

  visitLiteralExpr(_expr: Literal): void {
    return;
  }

  visitLogicalExpr(expr: Logical): void {
    this.resolveExpr(expr.left);
    this.resolveExpr(expr.right);
  }

  visitUnaryExpr(expr: Unary): void {
    this.resolveExpr(expr.right);
  }

  visitVariableExpr(expr: Variable): void {
    if (
      this.scopes.length > 0 &&
      this.scopes[this.scopes.length - 1].get(expr.name.lexeme) === false
    ) {
      Lox.error(expr.name, "Can't read local variable in its own initializer.");
    }

    this.resolveLocal(expr, expr.name);
  }

  private resolveStmt(stmt: Stmt): void {
    stmt.accept(this);
  }

  private resolveFunction(function_: _Function, type: FunctionType): void {
    const enclosingFunction = this.currentFunction;
    this.currentFunction = type;

    this.beginScope();
    for (const param of function_.params) {
      this.declare(param);
      this.define(param);
    }
    this.resolve(function_.body);
    this.endScope();
    this.currentFunction = enclosingFunction;
  }

  private resolveExpr(expr: Expr): void {
    expr.accept(this);
  }

  private beginScope(): void {
    this.scopes.push(new Map<string, boolean>());
  }

  private endScope(): void {
    this.scopes.pop();
  }

  private declare(name: Token): void {
    if (this.scopes.length === 0) return;

    const scope = this.scopes[this.scopes.length - 1];
    if (scope.has(name.lexeme)) {
      Lox.error(name, "Already a variable with this name in this scope.");
    }

    scope.set(name.lexeme, false);
  }

  private define(name: Token): void {
    if (this.scopes.length === 0) return;
    this.scopes[this.scopes.length - 1].set(name.lexeme, true);
  }

  private resolveLocal(expr: Expr, name: Token): void {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name.lexeme)) {
        this.interpreter.resolve(expr, this.scopes.length - 1 - i);
        return;
      }
    }
  }
}
