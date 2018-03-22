import "../init-fjsx";

const _demo = require("../scripts/_demo").view;
if (_demo && _demo.DEMO) {
  const demoDiv = document.getElementById("main");
  const header = document.createElement("h4");

  const demoList = _demo.DEMO();
  header.innerHTML = demoList.title;
  demoDiv.appendChild(header);

  for (var key in demoList.demos) {
    demoDiv.appendChild(demoList.demos[key]);
  }
}
