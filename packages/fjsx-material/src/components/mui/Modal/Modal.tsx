import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import { StandardProps } from "..";
import { BackdropProps, Backdrop } from "./Backdrop";
import { PortalProps } from "../Portal/Portal";

export interface ModalProps
  extends StandardProps<
      Fjsx.HtmlHTMLAttributes<HTMLDivElement> & Partial<PortalProps>,
      ModalClassKey
    > {
  BackdropComponent?: Fjsx.DetailedHTMLProps<any, BackdropProps>;
  BackdropProps?: Partial<BackdropProps>;
  disableAutoFocus?: boolean;
  disableBackdropClick?: boolean;
  disableEnforceFocus?: boolean;
  disableEscapeKeyDown?: boolean;
  disableRestoreFocus?: boolean;
  hideBackdrop?: boolean;
  keepMounted?: boolean;
  manager?: ModalManager;
  onBackdropClick?: Fjsx.FjsxEventHandler<{}>;
  onClose?: Fjsx.FjsxEventHandler<{}>;
  onEscapeKeyDown?: Fjsx.FjsxEventHandler<{}>;
  open: boolean;
}

export type ModalClassKey = "root" | "hidden";

export const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: theme.zIndex.modal,
    top: 0,
    left: 0
  },
  hidden: {
    visibility: "hidden"
  }
});

export const Modal = (props: ModalProps) => {
  fjsx.setDefaults(props, {
    disableAutoFocus: false,
    disableBackdropClick: false,
    disableEnforceFocus: false,
    disableEscapeKeyDown: false,
    disableRestoreFocus: false,
    hideBackdrop: false,
    keepMounted: false,
    // Modals don't open on the server so this won't conflict with concurrent requests.
    manager: new ModalManager(),
    BackdropComponent: Backdrop
  });
  const {
    BackdropComponent,
    BackdropProps,
    children,
    className,
    container,
    disableAutoFocus,
    disableBackdropClick,
    disableEnforceFocus,
    disableEscapeKeyDown,
    disableRestoreFocus,
    hideBackdrop,
    keepMounted,
    onBackdropClick,
    onClose,
    onEscapeKeyDown,
    onRendered,
    open,
    manager,
    ...other
  } = this.props;

  const classes = jssCssRulesWithTheme("MuiModal", props, styles);
  const { exited } = this.state;
  const hasTransition = getHasTransition(this.props);
  const childProps = {};

  if (!keepMounted && !open && (!hasTransition || exited)) {
    return null;
  }

  // It's a Transition like component
  if (hasTransition) {
    childProps.onExited = createChainedFunction(
      this.handleExited,
      children.props.onExited
    );
  }

  if (children.props.role === undefined) {
    childProps.role = children.props.role || "document";
  }

  if (children.props.tabIndex === undefined) {
    childProps.tabIndex = children.props.tabIndex || "-1";
  }

  return (
    <Portal
      ref={node => {
        this.mountNode = node ? node.getMountNode() : node;
      }}
      container={container}
      onRendered={this.handleRendered}
    >
      <div
        data-mui-test="Modal"
        className={classNames(classes.root, className, {
          [classes.hidden]: exited
        })}
        {...other}
      >
        {hideBackdrop ? null : (
          <BackdropComponent
            open={open}
            onClick={this.handleBackdropClick}
            {...BackdropProps}
          />
        )}
        <RootRef
          rootRef={node => {
            this.dialogElement = node;
          }}
        >
          {React.cloneElement(children, childProps)}
        </RootRef>
      </div>
    </Portal>
  );
};
