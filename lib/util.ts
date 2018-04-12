import { value } from "./f";

export const setDefaults = <T>(
  obj: T,
  defaults: { [key in keyof T]?: any }
) => {
  for (var key in defaults) {
    if (obj[key] === undefined) obj[key] = defaults[key];
  }
};
