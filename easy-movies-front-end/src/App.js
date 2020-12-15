import './App.css';
import style from './Generic.module.css';
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import MovieDetails from './Components/MovieDetails/MovieDetails';
import TopBar from "./Components/TopBar/TopBar.js";
import Cookies from 'universal-cookie';
import Homepage from "./Components/Homepage/Homepage";
import Particles from 'react-particles-js';
import axios from 'axios';
import { UserProfile } from './Components/UserProfile/UserProfile';
import Playlists from './Components/Playlists/Playlists.js';
import SearchMovies from './Components/Search/SearchMovies';
require('dotenv').config()

axios.defaults.withCredentials = true;

export const AuthContext = React.createContext({
  username: undefined,
  setUsername: () => { }
});

function App() {
  const cookies = new Cookies();

  const [username, setUsername] = useState(cookies.get("username"));
  const [keyword, setKeyword] = useState("");
  const value = { username, setUsername };

  return (

    <AuthContext.Provider value={value}>
      <div className={style.background} />
      <Router>
        <Route path="/"><TopBar onChange={setKeyword}/></Route>
        <Route path="/"><ParticelsBackground /></Route>
        <Route path="/movies/:movieId" component={MovieDetails}></Route>
        <Route path="/users/:username" component={UserProfile}></Route>
        <Route exact path="/"><Homepage /></Route>
        <Route exact path="/playlists"><Playlists /></Route>
        <Route path="/search"><SearchMovies keyword={keyword}/></Route>
      </Router>
    </AuthContext.Provider>
  );
}

const ParticelsBackground = () => (<Particles
  style={{ position: "fixed" }}
  params={{
    "particles": {
      "number": {
        "value": 200,
        "density": {
          "enable": true
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "speed": 4,
          "size_min": 0.1
        }
      },
      "line_linked": {
        "enable": false
      },
      "move": {
        "random": true,
        "speed": 2,
        "direction": "top",
        "out_mode": "out"
      }
    },
    "interactivity": {
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        }
      },
      "modes": {
        "bubble": {
          "distance": 250,
          "duration": 2,
          "size": 0,
          "opacity": 0
        },
        "repulse": {
          "distance": 400,
          "duration": 4
        }
      }
    }
  }} />)

export default App;