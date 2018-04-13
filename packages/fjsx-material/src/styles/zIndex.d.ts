export interface ZIndex {
  mobileStepper;
  appBar;
  drawer;
  modal;
  snackbar;
  tooltip;
}

export type ZIndexOptions = Partial<ZIndex>;

declare const zIndex: ZIndex;

export default zIndex;
