import { Expr } from "../../Parser/Expr.ts";
import { Parser } from "../../Parser/Parser.ts";
import { assignment } from "./binary/assignment/assignment.parser.ts";

export const expression = (parser: Parser): Expr => {
  return assignment(parser);
};
