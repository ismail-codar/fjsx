export declare const Fragment: unique symbol;
export declare const createElement: (tagName: string | Function | Symbol, attributes: {
    [key: string]: any;
}, ...childs: any[]) => any;
export declare const createSvgElement: (tagName: string, attributes: {
    [key: string]: any;
}, ...childs: any[]) => SVGElement;
export declare const addChildElements: (element: any, childs: any) => void;
export declare const createTextNode: (parent: any) => any;
export declare const cloneElement: (element: Element, attributes: any) => Element;
