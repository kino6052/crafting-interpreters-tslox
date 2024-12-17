// This file generates AST definitions and their visitor interface.
import { Token } from "./Token.ts";

async function main(args: string[]): Promise<void> {
  if (args.length !== 1) {
    console.error("Usage: generate_ast <output directory>");
    Deno.exit(64);
  }

  const outputDir = args[0];

  await defineAst(outputDir, "Expr", [
    "Assign   : Token name, Expr value",
    "Binary   : Expr left, Token operator, Expr right",
    "Grouping : Expr expression",
    "Literal  : any value",
    "Unary    : Token operator, Expr right",
    "Variable : Token name",
  ]);

  await defineAst(outputDir, "Stmt", [
    "Block      : Array<Stmt> statements",
    "Expression : Expr expression",
    "Print      : Expr expression",
    "Var        : Token name, Expr initializer",
  ]);
}

async function defineAst(
  outputDir: string,
  baseName: string,
  types: string[]
): Promise<void> {
  const path = `${outputDir}/${baseName}.ts`;
  const lines: string[] = [];

  lines.push("// This file is auto-generated.");
  lines.push('import { Token } from "./Token.ts";');
  lines.push('import { Expr } from "./Expr.ts";');
  lines.push("");

  // Generate the visitor interface
  defineVisitor(lines, baseName, types);

  // Generate the abstract base class
  lines.push(`export abstract class ${baseName} {`);
  lines.push(`  abstract accept<R>(visitor: Visitor<R>): R;`);
  lines.push("}");

  // Generate the concrete subclasses
  for (const type of types) {
    const [className, fields] = type.split(":").map((s) => s.trim());
    defineType(lines, baseName, className, fields);
  }

  await Deno.writeTextFile(path, lines.join("\n"));
}

function defineVisitor(
  lines: string[],
  baseName: string,
  types: string[]
): void {
  lines.push(`export interface Visitor<R> {`);

  for (const type of types) {
    const typeName = type.split(":")[0].trim();
    lines.push(
      `  visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}): R;`
    );
  }

  lines.push("}");
}

function defineType(
  lines: string[],
  baseName: string,
  className: string,
  fieldList: string
): void {
  lines.push("");
  lines.push(`export class ${className} extends ${baseName} {`);

  const fields = fieldList.split(", ").map((field) => {
    const [type, name] = field.split(" ");
    return { type, name };
  });

  // Define fields
  for (const field of fields) {
    lines.push(`  readonly ${field.name}: ${field.type};`);
  }

  // Define constructor
  const params = fields
    .map((field) => `${field.name}: ${field.type}`)
    .join(", ");
  lines.push("");
  lines.push(`  constructor(${params}) {`);
  lines.push("    super();");
  for (const field of fields) {
    lines.push(`    this.${field.name} = ${field.name};`);
  }
  lines.push("  }");

  // Define accept method
  lines.push("");
  lines.push(`  accept<R>(visitor: Visitor<R>): R {`);
  lines.push(`    return visitor.visit${className}${baseName}(this);`);
  lines.push("  }");

  lines.push("}");
}

if (import.meta.main) {
  await main(Deno.args);
}
