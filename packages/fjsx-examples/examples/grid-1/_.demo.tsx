import { Grid1, IGrid1 } from "./view";
import { cssLink } from "../util";

// https://vuejs.org/v2/examples/grid-component.html

const gridData = [
  { name: "Coşkun Göğen", power: Infinity },
  { name: "Cüneyt Arkın", power: 9000 },
  { name: "Süheyl Eğriboz", power: 7000 },
  { name: "Kadir İnanır", power: 8000 }
];
const data: IGrid1 = {
  gridColumns: ["name", "power"],
  filteredData$: gridData,
  gridData: gridData
};

const searchQuery = e => {
  var filterKey = e.target.value;
  data.filteredData$ = data.gridData.filter(function(row) {
    return Object.keys(row).some(function(key) {
      return (
        String(row[key])
          .toLowerCase()
          .indexOf(filterKey) > -1
      );
    });
  });
};

document.body.appendChild(
  <div>
    <form id="search">
      Search <input name="query" onInput={searchQuery} />
    </form>
    <Grid1 {...data} />
  </div>
);

document.body.appendChild(cssLink("/examples/grid-1/style.css"));
