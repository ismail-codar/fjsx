import { runLots } from './handlers';
import { update } from './store';

export const DemoView = (props: {
	state: {
		data$: any[];
		selected$: any;
		id: number;
	};
	handlers: { run: any; runLots: any; add: any; update: any; clear: any; swapRows: any; select: any; delete_: any };
}) => {
	const { state, handlers } = props;
	return (
		<div className="container">
			<div className="jumbotron">
				<div className="row">
					<div className="col-md-6">
						<h1>React non-keyed</h1>
					</div>
					<div className="col-md-6">
						<div className="row">
							<div className="col-sm-6 smallpad">
								<button
									type="button"
									className="btn btn-primary btn-block"
									id="run"
									onClick={handlers.run}
								>
									Create 1,000 rows
								</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button
									type="button"
									className="btn btn-primary btn-block"
									id="runlots"
									onClick={handlers.runLots}
								>
									Create 10,000 rows
								</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button
									type="button"
									className="btn btn-primary btn-block"
									id="add"
									onClick={handlers.add}
								>
									Append 1,000 rows
								</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button
									type="button"
									className="btn btn-primary btn-block"
									id="update"
									onClick={handlers.update}
								>
									Update every 10th row
								</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button
									type="button"
									className="btn btn-primary btn-block"
									id="clear"
									onClick={handlers.clear}
								>
									Clear
								</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button
									type="button"
									className="btn btn-primary btn-block"
									id="swaprows"
									onClick={handlers.swapRows}
								>
									Swap Rows
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<table className="table table-hover table-striped test-data">
				<tbody>
					{state.data$.map((d, i) => {
						return (
							<tr className={d.id === state.selected$ ? 'danger' : ''}>
								<td className="col-md-1">{d.id}</td>
								<td className="col-md-4">
									<a onClick={() => handlers.select(d.id)}>{d.label$}</a>
								</td>
								<td className="col-md-1">
									<a onClick={() => handlers.delete_(i)}>
										<span className="glyphicon glyphicon-remove" aria-hidden="true" />
									</a>
								</td>
								<td className="col-md-6" />
							</tr>
						);
					})}
				</tbody>
			</table>
			<span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
		</div>
	);
};
