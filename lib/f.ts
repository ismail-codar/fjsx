import { ObservableArray } from "./observable-array";
import { FJsxValue, FjsxArrayEventType } from "..";

export const value = <T>(value: T, freezed?: boolean): FJsxValue<T> => {
  const innerFn: any = (val?) => {
    if (Array.isArray(val)) {
      // TODO https://github.com/WebReflection/majinbuu
      innerFn["$val"].innerArray = val;
    } else innerFn["$val"] = val;
    const computes = innerFn["computes"];
    if (computes.length)
      for (var i = 0; i < computes.length; i++) {
        !computes[i]["freezed"] && computes[i](computes[i].compute());
      }
  };
  innerFn["$val"] = value;
  innerFn["freezed"] = freezed;

  innerFn["computes"] = [];
  if (value instanceof Function) {
    innerFn["compute"] = value;
  }
  innerFn.toJSON = () => innerFn["$val"];
  return innerFn;
};

export const array = <T>(
  items: T[]
): {
  on?: (
    type: FjsxArrayEventType,
    callback: (e: { item: T; index: number }) => void
  ) => void;
  removeEventListener?: (type: FjsxArrayEventType) => void;
  $val: T[];
} => {
  const arr = value(new ObservableArray(items)) as any;
  arr.on = arr.$val.on;
  arr.off = arr.$val.off;
  arr.toJSON = () => arr.$val.innerArray;

  return arr;
};

export const on = (
  arr: any[],
  type: FjsxArrayEventType,
  callback: (e: { item: any; index: number }) => void
) => {
  arr["$val"].on(type, callback);
};

export const off = (
  arr: any[],
  type: FjsxArrayEventType,
  callback: (e: { item: any; index: number }) => void
) => {
  arr["$val"].off(type, callback);
};

export const compute = (fn: () => void, ...args: any[]) => {
  var compute = value(fn);
  for (var i = 0; i < args.length; i++) {
    args[i]["computes"].push(compute);
  }
  fn();
};

export const initCompute = (fn: () => any, ...args: any[]) => {
  var cValue = value(fn());
  var cmpInner = function() {
    cValue(fn());
  };
  cmpInner["compute"] = cValue;
  for (var i = 0; i < args.length; i++) {
    args[i]["computes"].push(cmpInner);
  }

  return cValue;
};

export const setCompute = (prev: any, fn: () => void, ...args: any[]) => {
  destroy(prev);
  return initCompute(fn, ...args);
};

export const destroy = (item: any) => {
  delete item["compute"];
  delete item["computes"];
};
