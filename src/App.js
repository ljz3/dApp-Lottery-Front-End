import './App.css';
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Home from "./components/Home/Home";
import Enter from "./components/Enter/Enter";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <NavigationBar/>
      <Switch>
        <Route path="/enter" component={Enter}/>
        <Route path="/" component={Home}/>
      </Switch>
    </Router>
  );
}

export default App;
