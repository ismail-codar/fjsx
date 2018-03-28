import { IGrid1, grid1Controller } from "./types";

// var sortBy = (data$, sortKey) => {
//   data$ = data$.sort(function(a, b) {
//     a = a[sortKey];
//     b = b[sortKey];
//     return (a === b ? 0 : a > b ? 1 : -1) * 1;
//   });
// };

export const Grid1 = (props: IGrid1) => {
  const { gridColumns, gridData } = props;
  var filteredData$ = gridData;

  return (
    <table>
      <thead>
        <tr>
          {gridColumns.map(col => (
            <th onClick={() => grid1Controller.sortBy(filteredData$, col)}>
              <span>{col}</span>
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
