const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const users = require('./api/users.js');
const movies = require('./api/movies.js');
const reviews = require('./api/reviews.js');
const playlists = require('./api/playlists.js');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var router = express.Router();
const exceptionHandler = require('./libs/exceptionHandler');
const dbAdapter = require('./libs/dbAdapter');
const dataChecker = require("./libs/dataChecker");
const authorizations = require("./libs/authorizations");

console.log("USING ENVIRONMENT: " + process.env.NODE_ENV);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use("/", router);
app.use('/profile-images', express.static('public/profile-images'));


app.get('/', (req, res) => {
    res.send('home page');
});

//#####################################################
// USERS
//#####################################################

//User Register
app.post('/users/register', (req, res) => exceptionHandler.exceptionWrapper(users.registerUser, req, res));

//User Login
app.post('/users/login', (req, res) => exceptionHandler.exceptionWrapper(users.loginUser, req, res));

//User Logout
app.post('/users/:username/logout', (req, res) => exceptionHandler.exceptionWrapper(users.logoutUser, req, res));

//Get public user data
app.get('/users/:username', (req, res) => exceptionHandler.exceptionWrapper(users.getUserDetails, req, res));

//Delete user
app.delete('/users/:username', (req, res) => exceptionHandler.exceptionWrapper(users.deleteUser, req, res));

//SECURITY
router.use("/users/:username", (req, res, next) => {
    if(req.method === "GET" || req.params.username === "login" || req.params.username === "register"){
        next('route');
    }
    else{
        authorizations.authorizationCallBack(req, res, next);
    }
});

//#####################################################
// PLAYLISTS
//#####################################################


//Get user playlists
app.get('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(playlists.getPlaylists, req, res));

//Add movie to playlist
app.put('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(playlists.addMovieToPlaylist, req, res));

//Edit playlist name
app.patch('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(playlists.editPlaylistName, req, res));

//Remove movie from playlist
app.delete('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(playlists.removeMovieFromPlaylist, req, res));

//Create playlist
app.put('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(playlists.createPlaylist, req, res));

//Delete playlist
app.delete('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(playlists.deletePlaylist, req, res));

//SECURITY
router.use("/users/:username/playlists", authorizations.authorizationCallBack);

//#####################################################
// MOVIES
//#####################################################


//Get movie data
app.get('/movies/:movieId', (req, res) => exceptionHandler.exceptionWrapper(movies.getMovieData, req, res));


//#####################################################
// REVIEWS
//#####################################################


//Get movie reviews
app.get('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.getMovieReviews, req, res));

//Create movie review
app.put('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.createMovieReview, req, res));

//Update movie review
app.patch('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.updateMovieReview, req, res));

//Delete movie review
app.delete('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(reviews.deleteMovieReview, req, res));

//SECURITY
router.use("/movies/:movieId/reviews", (req,res,next) => {
    if (req.method==="GET") {
        next('route');
    }
    else {
        authorizations.authorizationCallBack(req,res,next);
    }
});

module.exports = app;