import * as babel from "@babel/core";
import { getExportSource } from "../../lib/export-sources";

getExportSource(
  "/Users/macbook/Documents/GitHub/fjsx/packages/fjsx-examples/examples/grid-2/types.ts",
  babel,
  {
    presets: [
      "@babel/preset-typescript",
      "@babel/preset-react",
      "@babel/preset-env"
    ],
    plugins: []
  }
).then(
  result => {
    console.log(result);
    /*
  {
    default: '/Users/xiphe/[...]/somePackage/src/DefaultComponent.js',
    HelperComponent: '/Users/xiphe/[...]/somePackage/src/lib/HelperComponent.js'
  }
  */
  },
  error => {
    console.log(error);
  }
);
