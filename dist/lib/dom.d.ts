import { FJsxValue } from '..';
export declare const conditionalElement: (parentElement: any, oldElement: any, newElementFn: () => any) => any;
export declare const insertToDom: (parentElement: any, index: any, itemElement: any) => void;
export declare const arrayMap: (arr: FJsxValue<any[]>, parentDom: Node, renderReturn: (item: any, idx?: number, isInsert?: boolean) => void) => void;
export declare const arrayMapWithClone: (arr: FJsxValue<any[]>, parentDom: any, renderTemplate: (i: number) => Element, updateList: any) => void;
