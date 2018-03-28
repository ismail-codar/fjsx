import classNames from "classnames";

export interface IGrid1 {
  gridColumns: string[];
  gridData: any[];
  filteredData$: any[];
}

const sortKeys = {};
var sortKey$ = "";
const sortBy = (data$: any[], sortKey) => {
  sortKeys[sortKey] = sortKeys[sortKey] === 1 ? -1 : 1;
  sortKey$ = sortKey;
  data$ = data$.slice().sort(function(a, b) {
    a = a[sortKey];
    b = b[sortKey];
    return (a === b ? 0 : a > b ? 1 : -1) * sortKeys[sortKey];
  });
};

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const Grid1 = (props: IGrid1) => {
  const { gridColumns } = props;

  return (
    <table>
      <thead>
        <tr>
          {gridColumns.map(key => (
            <th
              className={classNames({ active: sortKey$ == key })}
              onClick={() => sortBy(props.filteredData$, key)}
            >
              {capitalize(key)}
              <span
                className={classNames({
                  arrow: sortKey$ !== null,
                  asc: sortKeys[key] > 0,
                  dsc: sortKeys[key] < 0
                })}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.filteredData$.map(data => (
          <tr>{gridColumns.map(col => <td>{data[col]}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
};
