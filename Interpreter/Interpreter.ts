import { Assign } from "../common/expressions/binary/assignment/assignment.expression.ts";
import { Logical } from "../common/expressions/binary/assignment/or/logical.expression.ts";
import { interpretLogicalExpr } from "../common/expressions/binary/assignment/or/logical.interpreter.ts";
import { Binary } from "../common/expressions/binary/binary.expression.ts";
import { interpretBinaryExpr } from "../common/expressions/binary/binary.interpreter.ts";
import { Unary } from "../common/expressions/unary/unary.expression.ts";
import { interpretUnaryExpr } from "../common/expressions/unary/unary.interpreter.ts";
import { Lox } from "../Lox.ts";
import { Expr, Visitor } from "../Parser/Expr.ts";
import { Stmt, Visitor as StmtVisitor } from "../Parser/Stmt.ts";
import { interpretBlockStmt } from "../common/statements/block/block.interpreter.ts";
import { Block } from "../common/statements/block/block.statement.ts";
import { interpretPrintStmt } from "../common/statements/print/print.interpreter.ts";
import { interpretWhileStmt } from "../common/statements/loop/while/while.interpreter.ts";

import { interpretAssignmentExpr } from "../common/expressions/binary/assignment/assignment.interpreter.ts";
import { Call } from "../common/expressions/unary/call/call.expression.ts";
import { interpretCallExpr } from "../common/expressions/unary/call/call.interpreter.ts";
import { Grouping } from "../common/expressions/unary/call/primary/grouping/grouping.expression.ts";
import { interpretGroupingExpr } from "../common/expressions/unary/call/primary/grouping/grouping.interpreter.ts";
import { Literal } from "../common/expressions/unary/call/primary/literal/literal.expression.ts";
import { interpretLiteral } from "../common/expressions/unary/call/primary/literal/literal.interpreter.ts";
import { Variable } from "../common/expressions/unary/call/primary/variable/variable.expression.ts";
import { interpretVariableExpr } from "../common/expressions/unary/call/primary/variable/variable.interpreter.ts";
import { interpretExpressionStmt } from "../common/statements/expression/expression.interpreter.ts";
import { Expression } from "../common/statements/expression/expression.statement.ts";
import { interpretFunctionStmt } from "../common/statements/function/function.interpreter.ts";
import { Function } from "../common/statements/function/function.statement.ts";
import { interpretIfStmt } from "../common/statements/if/if.interpreter.ts";
import { If } from "../common/statements/if/if.statement.ts";
import { Print } from "../common/statements/print/print.statement.ts";
import { interpretReturnStmt } from "../common/statements/function/return/return.interpreter.ts";
import { Return } from "../common/statements/function/return/return.statement.ts";
import { interpretVarStmt } from "../common/statements/var/var.interpreter.ts";
import { Var } from "../common/statements/var/var.statement.ts";
import { While } from "../common/statements/loop/while/while.statement.ts";
import { Environment } from "./Environment.ts";
import { LoxCallable } from "./LoxCallable.ts";
import { RuntimeError } from "./RuntimeError.ts";

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
    return interpretFunctionStmt(stmt, this);
  }

  visitReturnStmt(stmt: Return): void {
    return interpretReturnStmt(stmt, this);
  }

  visitCallExpr(expr: Call): unknown {
    return interpretCallExpr(expr, this);
  }

  visitLiteralExpr(expr: Literal): unknown {
    return interpretLiteral(expr);
  }

  visitLogicalExpr(expr: Logical): unknown {
    return interpretLogicalExpr(expr, this);
  }

  visitIfStmt(stmt: If): void {
    return interpretIfStmt(stmt, this);
  }

  visitWhileStmt(stmt: While): void {
    return interpretWhileStmt(stmt, this);
  }

  visitUnaryExpr(expr: Unary): unknown {
    return interpretUnaryExpr(expr, this);
  }

  visitVariableExpr(expr: Variable): unknown {
    return interpretVariableExpr(expr, this);
  }

  visitGroupingExpr(expr: Grouping): unknown {
    return interpretGroupingExpr(expr, this);
  }

  evaluate(expr: Expr): unknown {
    return expr.accept(this);
  }

  execute(stmt: Stmt): void {
    stmt.accept(this);
  }

  visitExpressionStmt(stmt: Expression): void {
    return interpretExpressionStmt(stmt, this);
  }

  visitPrintStmt(stmt: Print): void {
    return interpretPrintStmt(stmt, this);
  }

  visitVarStmt(stmt: Var): void {
    return interpretVarStmt(stmt, this);
  }

  visitAssignExpr(expr: Assign): unknown {
    return interpretAssignmentExpr(expr, this);
  }
}
