import { EventedArray } from './evented-array';

export interface FJsxValue<T> {
	(val: T): void;
	readonly $val: T;
	freezed: boolean;
}

export type FjsxArrayEventType = 'itemadded' | 'itemset' | 'itemremoved';

export const value = <T>(value?: T, freezed?: boolean): FJsxValue<T> => {
	if (value && value['$val'] != undefined) throw 'Fjsx: Higher ordered signals is not supported.';
	const innerFn: any = (val?) => {
		if (Array.isArray(val) && !innerFn['$val'].innerArray) {
			// TODO arrayler için compile time x.$val = y şeklinde tanımlama olmuş olmalı o zaman yukardaki innerFn gereksiz olur
			// TODO https://github.com/WebReflection/majinbuu
			innerFn['$val'].innerArray = val;
		} else innerFn['$val'] = val;
		const computes = innerFn['computes'];
		if (computes.length)
			for (var i = 0; i < computes.length; i++) !computes[i]['freezed'] && computes[i](computes[i].compute());
	};
	innerFn['$val'] = value;
	innerFn['freezed'] = freezed;

	innerFn['computes'] = [];
	innerFn.toString = innerFn.toJSON = () => innerFn['$val'].toString();
	return innerFn;
};

export const array = <T>(
	items: T[]
): {
	on?: (type: FjsxArrayEventType, callback: (e: { item: T; index: number }) => void) => void;
	removeEventListener?: (type: FjsxArrayEventType) => void;
	$val: T[];
} => {
	const arr = value(new EventedArray(items)) as any;
	arr.on = arr.$val.on;
	arr.off = arr.$val.off;
	arr.toJSON = () => arr.$val.innerArray;

	return arr;
};

export const on = (arr: any[], type: FjsxArrayEventType, callback: (e: { item: any; index: number }) => void) => {
	arr['$val'].on(type, callback);
};

export const off = (arr: any[], type: FjsxArrayEventType, callback: (e: { item: any; index: number }) => void) => {
	arr['$val'].off(type, callback);
};

export const compute = (fn: () => void, ...args: any[]) => {
	var compute = value();
	compute['compute'] = fn;
	for (var i = 0; i < args.length; i++) args[i]['computes'].push(compute);
	fn();
};

export const initCompute = (fn: () => any, ...args: any[]) => {
	const cValue = value(fn());
	compute(() => {
		cValue(fn());
	}, ...args);
	return cValue;
};

export const setCompute = (prev: any, fn: () => void, ...args: any[]) => {
	destroy(prev);
	return initCompute(prev, fn, ...args);
};

export const destroy = (item: any) => {
	delete item['compute'];
	delete item['computes'];
};
