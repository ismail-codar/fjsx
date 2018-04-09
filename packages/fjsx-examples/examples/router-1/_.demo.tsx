import fjsx, { FJsxValue } from "fjsx";
import { Router, Route, Link } from "fjsx-router";

const Home = () => {
  return <div>Home</div>;
};

const About = () => {
  return <div>About</div>;
};

const Contact = () => {
  return <div>Contact</div>;
};

const Header = () => {
  return (
    <div>
      <Link to="/">Home</Link> |
      <Link to="/about">About</Link> |
      <Link to="/contact">Contact</Link>
    </div>
  );
};

const Body = () => {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </Router>
  );
};

var view = (
  <>
    <Header />
    <Body />
  </>
);

document.body.appendChild(view);
