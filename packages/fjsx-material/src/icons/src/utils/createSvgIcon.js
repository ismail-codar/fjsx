import { SvgIcon } from "../../../components/mui/SvgIcon";

const SvgIconCustom =
  (typeof global !== "undefined" && global.__MUI_SvgIcon__) || SvgIcon;

function createSvgIcon(path, displayName) {
  let Icon = props => <SvgIconCustom {...props}>{path}</SvgIconCustom>;

  Icon.displayName = displayName;
  Icon.muiName = "SvgIcon";

  return Icon;
}

export default createSvgIcon;
