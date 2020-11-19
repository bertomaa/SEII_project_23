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

const PORT = process.env.PORT || 5000;

console.log("USING ENVIRONMENT: " + process.env.NODE_ENV);

const app = express();

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
routerApiV1.use('/profile-images', express.static('public/profile-images'));


routerApiV1.get('/', (req, res) => {
    res.send('home page');
});

//User Register
routerApiV1.post('/users/register', (req, res) => exceptionHandler.exceptionWrapper(users.registerUser, req, res));

//User Login
routerApiV1.post('/users/login', (req, res) => exceptionHandler.exceptionWrapper(users.loginUser, req, res));

//User Logout
routerApiV1.post('/users/:username/logout', (req, res) => exceptionHandler.exceptionWrapper(users.logoutUser, req, res));

//Get public user data
routerApiV1.get('/users/:username', (req, res) => exceptionHandler.exceptionWrapper(users.getUserDetails, req, res));


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


//#####################################################
// MOVIES
//#####################################################


//Get movie data
routerApiV1.get('/movies/:movieId', (req, res) => exceptionHandler.exceptionWrapper(movies.getMovieData, req, res));


//#####################################################
// REVIEWS
//#####################################################


//Get movie reviews
routerApiV1.get('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.getMovieReviews, req, res));

//Create movie review
routerApiV1.put('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.createMovieReview, req, res));

//Update movie review
routerApiV1.patch('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.updateMovieReview, req, res));

//Delete movie review
routerApiV1.delete('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.deleteMovieReview, req, res));


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));