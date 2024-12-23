import { Assign } from "../expressions/binary/assignment/assignment.expression.ts";
import { Logical } from "../expressions/binary/assignment/or/logical.expression.ts";
import { interpretLogicalExpr } from "../expressions/binary/assignment/or/logical.interpreter.ts";
import { Binary } from "../expressions/binary/binary.expression.ts";
import { interpretBinaryExpr } from "../expressions/binary/binary.interpreter.ts";
import { Unary } from "../expressions/unary/unary.expression.ts";
import { interpretUnaryExpr } from "../expressions/unary/unary.interpreter.ts";
import { Lox } from "../Lox.ts";
import {
  Call,
  Expr,
  Grouping,
  Literal,
  Variable,
  Visitor,
} from "../Parser/Expr.ts";
import {
  Expression,
  Function,
  If,
  Return,
  Stmt,
  Visitor as StmtVisitor,
  Var,
} from "../Parser/Stmt.ts";
import { Token } from "../Scanner/Token.ts";
import { interpretBlockStmt } from "../statements/block/block.interpreter.ts";
import { Block } from "../statements/block/block.statement.ts";
import { interpretPrintStmt } from "../statements/print/print.interpreter.ts";
import { interpretWhileStmt } from "../statements/while/while.interpreter.ts";

import { Print } from "../statements/print/print.statement.ts";
import { While } from "../statements/while/while.statement.ts";
import { Environment } from "./Environment.ts";
import { LoxCallable } from "./LoxCallable.ts";
import { LoxFunction } from "./LoxFunction.ts";
import { Return as ReturnConstruct } from "./Return.ts";
import { RuntimeError } from "./RuntimeError.ts";
import { isTruthy } from "./utils.ts";

export class Interpreter implements Visitor<unknown>, StmtVisitor<void> {
  public globals: Environment = new Environment();
  public environment = this.globals;

  constructor() {
    this.globals.define("clock", {
      arity: () => 0,
      call: (interpreter: Interpreter, _arguments: unknown[]): unknown => {
        return Date.now() / 1000.0;
      },
      toString: () => "<native fn>",
    } satisfies LoxCallable);
  }

  visitBinaryExpr(expr: Binary): unknown {
    return interpretBinaryExpr(expr, this);
  }

  visitBlockStmt(stmt: Block): void {
    return interpretBlockStmt(stmt, this);
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
    return interpretLogicalExpr(expr, this);
  }

  visitIfStmt(stmt: If): void {
    if (isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }

  visitWhileStmt(stmt: While): void {
    return interpretWhileStmt(stmt, this);
  }

  visitUnaryExpr(expr: Unary): unknown {
    return interpretUnaryExpr(expr, this);
  }

  public visitVariableExpr(expr: Variable): unknown {
    return this.environment.get(expr.name);
  }

  public checkNumberOperand(operator: Token, operand: unknown): void {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  public checkNumberOperands(
    operator: Token,
    left: unknown,
    right: unknown
  ): void {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  visitGroupingExpr(expr: Grouping): unknown {
    return this.evaluate(expr.expression);
  }

  public evaluate(expr: Expr): unknown {
    return expr.accept(this);
  }

  public execute(stmt: Stmt): void {
    stmt.accept(this);
  }

  visitExpressionStmt(stmt: Expression): void {
    this.evaluate(stmt.expression);
  }

  visitPrintStmt(stmt: Print): void {
    interpretPrintStmt(stmt, this);
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
}
