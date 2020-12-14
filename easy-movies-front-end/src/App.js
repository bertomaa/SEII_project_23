import './App.css';
import style from './Generic.module.css';
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import TopBar from "./Components/TopBar/TopBar.js";
import Cookies from 'universal-cookie';
import Homepage from "./Components/Homepage/Homepage";
var jwt = require('jsonwebtoken');
require('dotenv').config()

export const AuthContext = React.createContext({
  username: undefined,
  setUsername: () => { }
});

function App() {
  const cookies = new Cookies();

  const [username, setUsername] = useState(cookies.get("username"));
  const value = { username, setUsername };

  return (
    <AuthContext.Provider value={value}>
      <div className={style.background} />
      <Router>
        <Route path="/"><TopBar /></Route>
        {/* <Route path="/search"><SearchMovies keyword={keyword} /></Route>
      <Route exact path="/MovieDetails/:id" component={MovieDetails} /> */}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;