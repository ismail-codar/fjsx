import * as fjsx from '../index';
import { FJsxValue } from '../dist';
import { insertToDom } from '../lib/dom';
const prettyhtml = require('@starptech/prettyhtml');
const { Document, Node, Text } = require('basichtml');

global['document'] = new Document();
global['Node'] = Node;

interface IDataRow {
	id: number;
	label$: FJsxValue<string>;
}

const state = {
	selected$: fjsx.value(1),
	data$: fjsx.array<IDataRow>([
		{
			id: 1,
			label$: fjsx.value('One')
		},
		{
			id: 2,
			label$: fjsx.value('Two')
		}
	])
};
const handlers = {
	select(id) {},
	delete_(id) {}
};

var table1 = fjsx.createElement('div', null, function(element) {
	fjsx.arrayMap(state.data$ as any, element, function(d: IDataRow, i: number) {
		return fjsx.createElement('span', {}, function(element) {
			element = fjsx.createTextNode(element);
			fjsx.compute(function() {
				element.textContent = d.label$.$val;
			}, d.label$);
		});
	});
});

var table2 = fjsx.createElement('div', null, function(element) {
	const updateList = [];
	updateList.push({
		path: [ 0 ],
		fn: function(element, dataItem, i) {
			fjsx.compute(function() {
				element.textContent = dataItem.label$.$val;
			}, dataItem.label$);
		}
	});
	const renderTemplate = (i) => fjsx.createElement('span', {}, state.data$.$val[i]);
	fjsx.arrayMapWithClone(state.data$ as any, element, renderTemplate, updateList);
});

const html = (table2 as HTMLTableElement).outerHTML;
console.log(prettyhtml(html).contents);
