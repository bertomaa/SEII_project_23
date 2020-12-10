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

const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBmLWXNgo2w4WkuqR3ieJa/KV3
InwwHp8fd+7DmHas1u/vuE2C/DJWOxNydCcrH7N5GjZmlfZUeGUq6WplbXFAkmLF
V8wixqxdJmVTBxRDvJU9+d85cC063wVFyt2HQwwmhNATwCJXfynMcQ7WKcmg+KZB
9MKbzV3cubBTtbc/VwIDAQAB`

export const AuthContext = React.createContext({
  username: undefined,
  setUsername: () => { }
});

async function App() {
  const cookies = new Cookies();
  let storedUsername;
  if (cookies.get("JWTtoken")) {
    storedUsername = jwt.verify(cookies.get("JWTtoken"), publicKey, (error, decode) => {
      console.log(decode.username)
      if (!!error || !!decode.username)
        storedUsername = undefined
      else
        storedUsername = decode.username
    });
  }

  const [username, setUsername] = useState("storedUsername");
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
