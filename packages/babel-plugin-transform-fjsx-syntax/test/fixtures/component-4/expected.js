Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.Main = void 0;
var _ProgressCircular = require('../../components/vue/vuetify/VProgressCircular/ProgressCircular');
var Main = function Main() {
	var value$ = fjsx.value(10);
	return fjsx.createElement(
		'div',
		null,
		fjsx.createElement(_ProgressCircular.ProgressCircular, {
			value$: value$
		})
	);
};
exports.Main = Main;
