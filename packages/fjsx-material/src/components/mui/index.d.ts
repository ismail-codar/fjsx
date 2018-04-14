export type ClassNameMap<ClassKey extends string = string> = Record<
  ClassKey,
  string
>;

export interface StyledComponentProps<ClassKey extends string = string> {
  classes?: Partial<ClassNameMap<ClassKey>>;
  innerRef?: Fjsx.Ref<any>;
}

/**
 * All standard components exposed by `material-ui` are `StyledComponents` with
 * certain `classes`, on which one can also set a top-level `className` and inline
 * `style`.
 */
export type StandardProps<
  C,
  ClassKey extends string,
  Removals extends keyof C = never
> = Omit<C & { classes: any }, "classes" | Removals> &
  StyledComponentProps<ClassKey> & {
    className?: string;
    style?: Fjsx.CSSProperties;
  };

export type PaletteType = "light" | "dark";
export interface Color {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  A100: string;
  A200: string;
  A400: string;
  A700: string;
}

/**
 * Utilies types based on:
 * https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 */

/** @internal */
type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

/** @internal */
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export namespace PropTypes {
  type Alignment = "inherit" | "left" | "center" | "right" | "justify";
  type Color = "inherit" | "primary" | "secondary" | "default";
  type Margin = "none" | "dense" | "normal";
}
