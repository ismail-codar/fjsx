var employee = {
    firstName$: fjsx.value("joe"),
    lastName$: fjsx.value("blow")
  },
  fullName = function fullName(e) {
    return e.firstName$.$val + " " + e.lastName$.$val;
  },
  div = fjsx.createElement("div", null, function(element) {
    element = fjsx.createTextNode(element);
    fjsx.compute(
      function() {
        element.textContent = fullName(employee);
      },
      employee.firstName$,
      employee.lastName$
    );
  });
employee.firstName$("john");
