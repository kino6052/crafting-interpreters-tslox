import { RuntimeError } from "./RuntimeError.ts";
import { Token } from "./Token.ts";

export class Environment {
  readonly enclosing: Environment | null;
  private readonly values: Map<string, unknown> = new Map();

  constructor(enclosing: Environment | null = null) {
    this.enclosing = enclosing;
  }

  getAt(distance: number, name: string): unknown {
    return this.ancestor(distance).values.get(name);
  }

  assignAt(distance: number, name: Token, value: unknown): void {
    this.ancestor(distance).values.set(name.lexeme, value);
  }

  ancestor(distance: number): Environment {
    let environment: Environment = this;
    for (let i = 0; i < distance; i++) {
      environment = environment.enclosing!;
    }
    return environment;
  }

  define(name: string, value: unknown): void {
    this.values.set(name, value);
  }

  get(name: Token): unknown {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }
    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }
    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }

  assign(name: Token, value: unknown): void {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }
    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }
    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }
}
