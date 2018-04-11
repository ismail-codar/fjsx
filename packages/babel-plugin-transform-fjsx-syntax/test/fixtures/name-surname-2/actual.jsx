const employee = { firstName$: "joe", lastName$: "blow" },
  fullName = e => e.firstName$ + " " + e.lastName$,
  div = <div>{fullName(employee)}</div>;
employee.firstName$ = "john";
