import './App.css';
import style from './Generic.module.css';
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import TopBar from "./Components/TopBar/TopBar.js";
import Cookies from 'universal-cookie';
var jwt = require('jsonwebtoken');

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBmLWXNgo2w4WkuqR3ieJa/KV3
InwwHp8fd+7DmHas1u/vuE2C/DJWOxNydCcrH7N5GjZmlfZUeGUq6WplbXFAkmLF
V8wixqxdJmVTBxRDvJU9+d85cC063wVFyt2HQwwmhNATwCJXfynMcQ7WKcmg+KZB
9MKbzV3cubBTtbc/VwIDAQAB
-----END PUBLIC KEY-----`

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