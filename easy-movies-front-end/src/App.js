import './App.css';
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import TopBar from "./Components/TopBar/TopBar.js";


function App() {

  const [keyword, setKeyword] = useState("");

  return (
    <Router>
      <Route path="/"><TopBar onChange={setKeyword} /></Route>
      <Route exact path="/" component={Homepage}></Route>
      {/* <Route path="/search"><SearchMovies keyword={keyword} /></Route>
      <Route exact path="/MovieDetails/:id" component={MovieDetails} /> */}
    </Router>
  );
}

export default App;
