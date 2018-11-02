export interface IBenchmarkDataRow {
	id: number;
	label$: string;
}

export interface IBenchmarkDataRowsWithId {
	id: number;
	data: IBenchmarkDataRow[];
}

export type BenchmarkDataType = IBenchmarkDataRow[];

const _random = (max) => {
	return Math.round(Math.random() * 1000) % max;
};
export const buildData = (id, count = 1000): IBenchmarkDataRowsWithId => {
	var adjectives = [
		'pretty',
		'large',
		'big',
		'small',
		'tall',
		'short',
		'long',
		'handsome',
		'plain',
		'quaint',
		'clean',
		'elegant',
		'easy',
		'angry',
		'crazy',
		'helpful',
		'mushy',
		'odd',
		'unsightly',
		'adorable',
		'important',
		'inexpensive',
		'cheap',
		'expensive',
		'fancy'
	];
	var colours = [ 'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange' ];
	var nouns = [
		'table',
		'chair',
		'house',
		'bbq',
		'desk',
		'car',
		'pony',
		'cookie',
		'sandwich',
		'burger',
		'pizza',
		'mouse',
		'keyboard'
	];
	var data: IBenchmarkDataRow[] = [];
	let dataRow: IBenchmarkDataRow;
	for (var i = 0; i < count; i++) {
		dataRow = {
			id: id++,
			label$:
				adjectives[_random(adjectives.length)] +
				' ' +
				colours[_random(colours.length)] +
				' ' +
				nouns[_random(nouns.length)]
		};
		data.push(dataRow);
	}
	return { data, id };
};

export const add = (id: number, data) => {
	const newData = buildData(id, 1000);

	return { data: [ ...data, ...newData.data ], id: newData.id };
};
export const run = (id: number) => {
	return buildData(id);
};
export const runLots = (id: number) => {
	return buildData(id, 10000);
};
export const update = (data$: BenchmarkDataType) => {
	for (let i = 0; i < data$.length; i += 10) {
		data$[i].label$ = data$[i].label$ + ' !!!';
	}
};

export const swapRows = (data: IBenchmarkDataRow[]) => {
	const x = 1,
		y = 998;
	data.splice(y, 1, data.splice(x, 1, data[y])[0]);
};
export const deleteRow = (data, id) => {
	return data.filter((d) => {
		return d.id != id;
	});
};
