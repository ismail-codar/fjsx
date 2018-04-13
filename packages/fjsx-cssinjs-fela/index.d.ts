// https://github.com/rofrischmann/fela/blob/master/docs/basics/Rules.md

export interface FelaCSSRules extends CSSStyleDeclaration {
  //Pseudo-elements
  "::after": Partial<FelaCSSRules>;
  "::before": Partial<FelaCSSRules>;
  "::first-letter": Partial<FelaCSSRules>;
  "::first-line": Partial<FelaCSSRules>;
  "::selection": Partial<FelaCSSRules>;
  "::backdrop": Partial<FelaCSSRules>;
  //Pseudo-classes
  ":active": Partial<FelaCSSRules>;
  ":any": Partial<FelaCSSRules>;
  ":any-link": Partial<FelaCSSRules>;
  ":checked": Partial<FelaCSSRules>;
  ":default": Partial<FelaCSSRules>;
  ":defined": Partial<FelaCSSRules>;
  ":dir()": Partial<FelaCSSRules>;
  ":disabled": Partial<FelaCSSRules>;
  ":empty": Partial<FelaCSSRules>;
  ":enabled": Partial<FelaCSSRules>;
  ":first": Partial<FelaCSSRules>;
  ":first-child": Partial<FelaCSSRules>;
  ":first-of-type": Partial<FelaCSSRules>;
  ":fullscreen": Partial<FelaCSSRules>;
  ":focus": Partial<FelaCSSRules>;
  ":focus-visible": Partial<FelaCSSRules>;
  ":host": Partial<FelaCSSRules>;
  ":host()": Partial<FelaCSSRules>;
  ":host-context()": Partial<FelaCSSRules>;
  ":hover": Partial<FelaCSSRules>;
  ":indeterminate": Partial<FelaCSSRules>;
  ":in-range": Partial<FelaCSSRules>;
  ":invalid": Partial<FelaCSSRules>;
  ":lang()": Partial<FelaCSSRules>;
  ":last-child": Partial<FelaCSSRules>;
  ":last-of-type": Partial<FelaCSSRules>;
  ":left": Partial<FelaCSSRules>;
  ":link": Partial<FelaCSSRules>;
  ":not()": Partial<FelaCSSRules>;
  ":nth-child()": Partial<FelaCSSRules>;
  ":nth-last-child()": Partial<FelaCSSRules>;
  ":nth-last-of-type()": Partial<FelaCSSRules>;
  ":nth-of-type()": Partial<FelaCSSRules>;
  ":only-child": Partial<FelaCSSRules>;
  ":only-of-type": Partial<FelaCSSRules>;
  ":optional": Partial<FelaCSSRules>;
  ":out-of-range": Partial<FelaCSSRules>;
  ":read-only": Partial<FelaCSSRules>;
  ":read-write": Partial<FelaCSSRules>;
  ":required": Partial<FelaCSSRules>;
  ":right": Partial<FelaCSSRules>;
  ":root": Partial<FelaCSSRules>;
  ":scope": Partial<FelaCSSRules>;
  ":target": Partial<FelaCSSRules>;
  ":valid": Partial<FelaCSSRules>;
  ":visited": Partial<FelaCSSRules>;
}
export function cssRules(rule: Partial<FelaCSSRules>, params?): string;
