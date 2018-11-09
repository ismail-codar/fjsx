export interface FJsxValue<T> {
    (val: T): void;
    readonly $val: T;
    freezed: boolean;
}
export declare type FjsxArrayEventType = 'itemadded' | 'itemset' | 'itemremoved';
export declare const value: <T>(value?: T, freezed?: boolean) => FJsxValue<T>;
export declare const array: <T>(items: T[]) => {
    on?: (type: FjsxArrayEventType, callback: (e: {
        item: T;
        index: number;
    }) => void) => void;
    removeEventListener?: (type: FjsxArrayEventType) => void;
    $val: T[];
} & FJsxValue<T>;
export declare const on: (arr: any[], type: FjsxArrayEventType, callback: (e: {
    item: any;
    index: number;
}) => void) => void;
export declare const off: (arr: any[], type: FjsxArrayEventType, callback: (e: {
    item: any;
    index: number;
}) => void) => void;
export declare const compute: (fn: () => void, ...args: any[]) => void;
export declare const initCompute: (fn: () => any, ...args: any[]) => FJsxValue<any>;
export declare const setCompute: (prev: any, fn: () => void, ...args: any[]) => FJsxValue<any>;
export declare const destroy: (item: any) => void;
