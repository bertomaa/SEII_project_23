import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import Playlists from "./Components/Playlists/Playlists";
require('dotenv').config()


function App() {
  return (
    <Router>
        <Route exact path="/" component={Homepage}></Route>
        <Route exact path="/playlists" component={Playlists}></Route>
    </Router>
  );
}

export default App;
