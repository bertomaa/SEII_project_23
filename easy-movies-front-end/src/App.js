import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage"

function App() {
  return (
    <Router>
        <Route exact path="/" component={Homepage}></Route>
    </Router>
);
}

export default App;
