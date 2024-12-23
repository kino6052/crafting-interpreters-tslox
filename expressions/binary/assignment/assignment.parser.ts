import { Expr, Variable } from "../../../Parser/Expr.ts";
import { Parser } from "../../../Parser/Parser.ts";
import { TokenType } from "../../../Scanner/TokenType.ts";
import { Assign } from "./assignment.expression.ts";
import { or } from "./or/or.parser.ts";

export const assignment = (parser: Parser): Expr => {
  const expr = or(parser);

  if (parser.match(TokenType.EQUAL)) {
    const equals = parser.previous();
    const value = assignment(parser);
    if (expr instanceof Variable) {
      const name = expr.name;
      return new Assign(name, value);
    }
    parser.error(equals, "Invalid assignment target.");
  }
  return expr;
};
