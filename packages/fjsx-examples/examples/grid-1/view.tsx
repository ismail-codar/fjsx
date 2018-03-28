import classNames from "classnames";

export interface IGrid1 {
  searchQuery: string;
  gridColumns: string[];
  gridData: any[];
  filteredData?: any[];
}

const sortKeys$ = {};
var sortKey$ = "";
const sortBy = (data$: any[], sortKey) => {
  sortKey$ = sortKey;
  sortKeys$[sortKey] = sortKeys$[sortKey] === 1 ? -1 : 1;
  data$ = data$.slice().sort(function(a, b) {
    a = a[sortKey];
    b = b[sortKey];
    return (a === b ? 0 : a > b ? 1 : -1) * sortKeys$[sortKey];
  });
};

export const Grid1 = (props: IGrid1) => {
  const { gridColumns, gridData } = props;
  var filteredData$ = gridData;

  return (
    <table>
      <thead>
        <tr>
          {gridColumns.map(key => (
            <th
              className={classNames({ active: sortKey$ == key })}
              onClick={() => sortBy(filteredData$, key)}
            >
              {key}
              <span
                className={classNames({
                  arrow: true,
                  asc: sortKeys$[key] > 0,
                  dsc: sortKeys$[key] < 0
                })}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData$.map(data => (
          <tr>{gridColumns.map(col => <td>{data[col]}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
};
