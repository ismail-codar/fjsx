import * as fjsx from '../index';

jasmine.getEnv().throwOnExpectationFailure(true);

it('array value set', () => {
	const added = [];
	const arr = fjsx.array([]);

	arr.on('itemadded', (e) => {
		added.push(e);
	});

	arr.$val.push(1);
	arr([]);
	arr.$val.push(2);

	expect(
		JSON.stringify([ { type: 'itemadded', index: 0, item: 1 }, { type: 'itemadded', index: 1, item: 2 } ])
	).toEqual(JSON.stringify(added));
});
