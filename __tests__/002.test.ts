import { Lox } from "../Lox.ts";

// NOTE: Just debug in vscode
Lox.run(
  `
  函数 斐波那契(n) {
    如果 (n <= 1) 返回 n; 
    返回 斐波那契(n - 1) + 斐波那契(n - 2); 
  }

  输出 斐波那契(10);
`
);
