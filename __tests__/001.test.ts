import { Lox } from "../Lox.ts";

// NOTE: Just debug in vscode
Lox.run(
  `
  函数 中文() {
    变量 什么 = "什么";
    变量 东西 = "东西";

    输出 什么 + 东西;
  }

  中文();
`
);
