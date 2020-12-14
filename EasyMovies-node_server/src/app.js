const express = require('express');
const users = require('./api/users.js');
const movies = require('./api/movies.js');
const reviews = require('./api/reviews.js');
const playlists = require('./api/playlists.js');
const exceptionHandler = require('./libs/exceptionHandler');
const dbAdapter = require('./libs/dbAdapter');
const dataChecker = require("./libs/dataChecker");
const authorizations = require("./libs/authorizations");
const apiVersionManager = require('express-api-version-manager');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
require('dotenv').config();


const PORT = process.env.PORT || 5001;

console.log("USING ENVIRONMENT: " + process.env.NODE_ENV);
console.log("USING API KEY    : " + process.env.TMDB_API_KEY);

const app = express();

// app.use(cors())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let authorizationRouter = express.Router();
var routerApiV1 = express.Router();
var routerApiV2 = express.Router();

app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

authorizationRouter.use("/users/:username/playlists", authorizations.authorizationCallBack);

app.use('/api/:apiVersion', apiVersionManager({
  apiVersionParamName: 'apiVersion',
  versions: {
    v1: {
      router: routerApiV1
    },
    v2: {
      router: routerApiV2
    }
  }
}
));


routerApiV1.use("/", authorizationRouter);
routerApiV2.use("/", authorizationRouter);
app.use(express.static('public'));


routerApiV1.get('/', (req, res) => {
  res.send('live');
});

//#####################################################
// USERS
//#####################################################

//User Register
routerApiV1.post('/users/register', (req, res) => exceptionHandler.exceptionWrapper(users.registerUser, req, res));

//User Login
routerApiV1.post('/users/login', (req, res) => exceptionHandler.exceptionWrapper(users.loginUser, req, res));

//User Logout
routerApiV1.post('/users/:username/logout', (req, res) => exceptionHandler.exceptionWrapper(users.logoutUser, req, res));

//Get public user data
routerApiV1.get('/users/:username', (req, res) => exceptionHandler.exceptionWrapper(users.getUserDetails, req, res));

//Delete user
routerApiV1.delete('/users/:username', (req, res) => exceptionHandler.exceptionWrapper(users.deleteUser, req, res));

//SECURITY
authorizationRouter.use("/users/:username", (req, res, next) => {
  if (req.method === "GET" || req.params.username === "login" || req.params.username === "register") {
    next('route');
  }
  else {
    authorizations.authorizationCallBack(req, res, next);
  }
});

//#####################################################
// PLAYLISTS
//#####################################################


//Get user playlists
routerApiV1.get('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(playlists.getPlaylists, req, res));

//Add movie to playlist
routerApiV1.put('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(playlists.addMovieToPlaylist, req, res));

//Edit playlist name
routerApiV1.patch('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(playlists.editPlaylistName, req, res));

//Remove movie from playlist
routerApiV1.delete('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(playlists.removeMovieFromPlaylist, req, res));

//Create playlist
routerApiV1.put('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(playlists.createPlaylist, req, res));

//Delete playlist
routerApiV1.delete('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(playlists.deletePlaylist, req, res));

//Version 2

//Get user playlists
routerApiV2.get('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(playlists.getPlaylistsV2, req, res));

//SECURITY
authorizationRouter.use("/users/:username/playlists", authorizations.authorizationCallBack);

//#####################################################
// MOVIES
//#####################################################

// Version 1

//Get movie data
routerApiV1.get('/movies/:movieId', (req, res) => exceptionHandler.exceptionWrapper(movies.getMovieDataV1, req, res));

//Get catalog
routerApiV1.get('/catalog/:catalogName', (req, res) => exceptionHandler.exceptionWrapper(movies.getCatalogRoutingV1, req, res));

//Version 2

//Get movie data
routerApiV2.get('/movies/:movieId', (req, res) => exceptionHandler.exceptionWrapper(movies.getMovieDataV2, req, res));

//Get catalog
routerApiV2.get('/catalog/:catalogName', (req, res) => exceptionHandler.exceptionWrapper(movies.getCatalogRoutingV2, req, res));

//#####################################################
// REVIEWS
//#####################################################

// Version 1

//Get movie reviews
routerApiV1.get('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.getMovieReviewsV1, req, res));

//Get user reviews
routerApiV1.get('/users/:username/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.getUserReviews, req, res));

//Create movie review
routerApiV1.put('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.createMovieReviewV1, req, res));

//Update movie review
routerApiV1.patch('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.updateMovieReviewV1, req, res));

//Delete movie review
routerApiV1.delete('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.deleteMovieReviewV1, req, res));

// Version 2

//Get movie reviews
routerApiV2.get('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.getMovieReviewsV2, req, res));

//Create movie review
routerApiV2.put('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.createMovieReviewV2, req, res));

//Update movie review
routerApiV2.patch('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.updateMovieReviewV2, req, res));

//Delete movie review
routerApiV2.delete('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.deleteMovieReviewV2, req, res));


//SECURITY
authorizationRouter.use("/movies/:movieId/reviews", (req, res, next) => {
  if (req.method === "GET") {
    next('route');
  }
  else {
    authorizations.authorizationCallBack(req, res, next);
  }
});

module.exports = { app, routerApiV1, routerApiV2 };
