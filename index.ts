/// <reference path="JSX.d.ts" />

import * as f from "./lib/f";
import * as dom from "./lib/dom";
import * as domTree from "./lib/dom-tree";

export interface FJsxValue<T> {
  (val: T): void;
  readonly $val: T;
  freezed: boolean;
}

export type FjsxArrayEventType = "itemadded" | "itemset" | "itemremoved";

export const fjsx = Object.assign(f, dom, domTree);
