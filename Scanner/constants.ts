import { TokenType } from "./TokenType.ts";

export const keywords: Record<string, TokenType> = {
  和: TokenType.AND, // he2
  类: TokenType.CLASS, // lei4
  否则: TokenType.ELSE, // fou3ze2
  错: TokenType.FALSE, // cuo4
  迭代: TokenType.FOR, // die2dai4
  函数: TokenType.FUN, // han2shu4
  如果: TokenType.IF, // ru2guo3
  零: TokenType.NIL, // ling2
  或: TokenType.OR, // huo4
  输出: TokenType.PRINT, // shu1chu1
  返回: TokenType.RETURN, // fan3hui2
  超: TokenType.SUPER, // chao1
  这: TokenType.THIS, // zhe4
  对: TokenType.TRUE, // dui4
  变量: TokenType.VAR, // bian4liang4
  虽然: TokenType.WHILE, // sui1ran
};
