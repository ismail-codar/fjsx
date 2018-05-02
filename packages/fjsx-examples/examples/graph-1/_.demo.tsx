import { cssRules } from "@fjsx/cssinjs-fela";
import * as webcola from "webcola";
import { LayoutAdaptor } from "./layout";

// TODO https://anseki.github.io/plain-draggable/

const classes = {
  svg: cssRules({
    border: "solid 1px gray",
    marginLeft: "2px",
    marginTop: "20px"
  }),
  node: cssRules({
    stroke: "#fff",
    strokeWidth: "1.5px",
    cursor: "move",
    fill: "rgb(31, 119, 180)"
  }),
  link: cssRules({
    stroke: "#999",
    strokeWidth: "3px",
    strokeOpacity: "1"
  }),
  label: cssRules({
    fill: "white",
    fontFamily: "Verdana",
    fontSize: "25px",
    textAnchor: "middle",
    cursor: "move"
  })
};

interface IGraphNode {
  x: number;
  y: number;
  name: string;
}

const GraphNode = (props: IGraphNode) => {
  if (!props.x) return null;
  const x$ = props.x;
  const y$ = props.y;

  fjsx.mapProperty(props, "x", x$);
  fjsx.mapProperty(props, "y", y$);

  return (
    <g>
      <rect
        className={classes.node}
        width="60"
        height="40"
        rx="5"
        ry="5"
        x={x$}
        y={y$}
      >
        <title>{props.name}</title>
      </rect>
      <text className={classes.label} x={x$ + 30} y={y$ + 30}>
        {props.name}
      </text>
    </g>
  );
};

const GraphLink = (props: { source: IGraphNode; target: IGraphNode }) => {
  if (props.source.x === undefined) return null;
  const x1$ = props.source.x;
  const y1$ = props.source.y;
  const x2$ = props.target.x;
  const y2$ = props.target.y;
  fjsx.mapProperty(props.source, "x", x1$);
  fjsx.mapProperty(props.source, "y", y1$);
  fjsx.mapProperty(props.target, "x", x2$);
  fjsx.mapProperty(props.target, "y", y2$);
  return <line className={classes.link} x1={x1$} y1={y1$} x2={x2$} y2={y2$} />;
};

//////////////////////////////////////////////////////////////////////////////////////////////////
var cola = new LayoutAdaptor(960, 500);

cola.on("tick", () => {});

var graph$ = null;
fetch("/examples/graph-1/fivenodesdisconnected.json").then(response => {
  response.json().then(graph => {
    cola
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
    graph$ = graph;
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

var viewGraph = (
  <div>
    <svg className={classes.svg} width="960" height="500">
      {graph$ === null ? null : (
        <>
          {graph$.nodes.map(node => <GraphNode {...node} />)}
          {graph$.links.map(link => <GraphLink {...link} />)}
        </>
      )}
    </svg>
  </div>
);

var obj = { x: 1 };
var x1$ = 500;
var x2$ = 600;
fjsx.mapProperty(obj, "x", x1$);
fjsx.mapProperty(obj, "x", x2$);
setTimeout(() => {
  x1$ = 100;
}, 1000);
console.log(obj.x);

document.body.appendChild(viewGraph);
