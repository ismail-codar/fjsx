export declare const startContext: (key: string, value: any) => void;
export declare const getContextValue: (key: string) => any;
export declare const endContext: (key: string) => void;
export declare const Context: (props: {
    key: string;
    value: any;
}) => any;
