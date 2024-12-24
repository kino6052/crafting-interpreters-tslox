import { expect } from "jsr:@std/expect";
import { isAlpha } from "./identifier.ts";

Deno.test("should return true for ASCII letters", () => {
  expect(isAlpha("a")).toBe(true);
  expect(isAlpha("Z")).toBe(true);
  expect(isAlpha("m")).toBe(true);
  expect(isAlpha("Q")).toBe(true);
  expect(isAlpha("和是")).toBe(true);
});

// Returns false for empty string input
Deno.test("should return false for empty string", () => {
  expect(isAlpha("")).toBe(false);
});
