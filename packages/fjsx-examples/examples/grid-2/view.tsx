import classNames from "classnames";
import { gridControler, IGrid2 } from "./types";

export const Grid2 = (props: IGrid2) => {
  const { gridColumns } = props;

  return (
    <table>
      <thead>
        <tr>
          {gridColumns.map(key => (
            <th
              className={classNames({ active: gridControler.sortKey$ == key })}
              onClick={() => gridControler.sortBy(props.filteredData$, key)}
            >
              {gridControler.capitalize(key)}
              <span
                className={classNames({
                  arrow: gridControler.sortKey$ !== null,
                  asc: gridControler.sortKeys[key] > 0,
                  dsc: gridControler.sortKeys[key] < 0
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
