import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage"
import MovieDetails from './Components/MovieDetails/MovieDetails';
require('dotenv').config();

function App() {
  return (
    <Router>
        <Route exact path="/" component={Homepage}></Route>
        <Route path="/movies/:movieId" component={MovieDetails}></Route>
    </Router>
);
}

export default App;
