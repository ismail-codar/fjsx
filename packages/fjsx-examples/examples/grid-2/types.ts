export interface IGrid2 {
  gridColumns: string[];
  gridData: any[];
  filteredData$: any[];
}

export const gridControler = {
  sortKeys: {},
  sortKey$: "",
  sortBy(data$: any[], sortKey) {
    this.sortKeys[sortKey] = this.sortKeys[sortKey] === 1 ? -1 : 1;
    this.sortKey$ = sortKey;
    data$ = data$.slice().sort(function(a, b) {
      a = a[sortKey];
      b = b[sortKey];
      return (a === b ? 0 : a > b ? 1 : -1) * this.sortKeys[sortKey];
    });
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
