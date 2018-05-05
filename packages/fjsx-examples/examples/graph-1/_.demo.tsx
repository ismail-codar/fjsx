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
    cursor: "move",
    userSelect: "none"
  })
};

interface IGraphNode {
  x: number;
  y: number;
  width: number;
  height: number;
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
        x={x$ - props.width / 2}
        y={y$ - props.height / 2}
      >
        <title>{props.name}</title>
      </rect>
      <text className={classes.label} x={x$} y={y$ + 10}>
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
var pt = null;
var svg = null;
const offset = { x: 0, y: 0 };
function cursorPoint(evt) {
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

const initSvg = element => {
  svg = element;
  pt = svg.createSVGPoint();
};

var dragNode: IGraphNode = null;
const onMouseDown = (e: Fjsx.MouseEvent<SVGSVGElement>) => {
  const path: Element[] = e["path"].slice();
  while (path.length) {
    var item = path.shift();
    if (item.tagName === "g") {
      dragNode = item["$props"];
      const pt = cursorPoint(e);
      offset.x = pt.x - dragNode.x;
      offset.y = pt.y - dragNode.y;
      LayoutAdaptor.dragStart(dragNode);
      break;
    }
  }
};

const onMouseMove = (e: Fjsx.MouseEvent<SVGSVGElement>) => {
  if (!dragNode) return;
  const pt = cursorPoint(e);
  pt.x -= offset.x;
  pt.y -= offset.y;
  LayoutAdaptor.drag(dragNode, pt);
  cola.resume();
};
const onMouseUp = (e: Fjsx.MouseEvent<SVGSVGElement>) => {
  dragNode && LayoutAdaptor.dragEnd(dragNode);
  dragNode = null;
};

var viewGraph = (
  <div>
    <svg
      ref={initSvg}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      className={classes.svg}
      width="960"
      height="500"
    >
      {graph$ === null ? null : (
        <>
          {graph$.links.map(link => <GraphLink {...link} />)}
          {graph$.nodes.map(node => <GraphNode {...node} />)}
        </>
      )}
    </svg>
  </div>
);

document.body.appendChild(viewGraph);
