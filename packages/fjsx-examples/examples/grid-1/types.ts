export interface IGrid1 {
  searchQuery: string;
  gridColumns: string[];
  gridData: any[];
  filteredData?: any[];
}

export const grid1Controller = {
  sortBy(data$, sortKey) {
    data$ = data$.sort(function(a, b) {
      a = a[sortKey];
      b = b[sortKey];
      return (a === b ? 0 : a > b ? 1 : -1) * 1;
    });
  }
};
