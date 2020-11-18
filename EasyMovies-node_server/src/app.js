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
const exceptionHandler = require('./exceptionHandler');
const dbAdapter = require('./dbAdapter');
const dataChecker = require("./dataChecker");

console.log("USING ENVIRONMENT: " + process.env.NODE_ENV);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.use("/users/:username/playlists", function (req, res, next) {
    console.log(req.cookies)
    if (req.cookies && req.cookies.sessionId) {
        const username = req.params.username;
        const uuid = req.cookies.sessionId;
        if (dataChecker.checkFieldsNull([username, uuid]))
            res.status(400).send();
        console.log("ci sono i cookie")
        dbAdapter.checkUuid(uuid).then(r => {
            if (!r) {
                console.log("next!");
                next('route');
            } else {
                console.log("uuid non valido");
                res.status(401).send();
            }
        })
    } else {
        console.log("uuid non presente")
        res.status(401).send();
    }
});


app.use("/", router);
app.use('/profile-images', express.static('public/profile-images'));


app.get('/', (req, res) => {
    res.send('home page');
});

//User Register
app.post('/users/register', (req, res) => exceptionHandler.exceptionWrapper(users.registerUser, req, res));

//User Login
app.post('/users/login', (req, res) => exceptionHandler.exceptionWrapper(users.loginUser, req, res));

//User Logout
app.post('/users/:username/logout', (req, res) => exceptionHandler.exceptionWrapper(users.logoutUser, req, res));

//Get public user data
app.get('/users/:username', (req, res) => exceptionHandler.exceptionWrapper(users.getUserDetails, req, res));


//#####################################################
// PLAYLISTS
//#####################################################


//Get user playlists
app.get('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(users.getPlaylists, req, res));

//Add movie to playlist
app.put('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(users.addMovieToPlaylist, req, res));

//Edit playlist name
app.patch('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(users.editPlaylistName, req, res));

//Remove movie from playlist
app.delete('/users/:username/playlists/:playlist', (req, res) => exceptionHandler.exceptionWrapper(users.removeMovieFromPlaylist, req, res));

//Create playlist
app.put('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(users.createPlaylist, req, res));

//Delete playlist
app.delete('/users/:username/playlists', (req, res) => exceptionHandler.exceptionWrapper(users.deletePlaylist, req, res));


//#####################################################
// MOVIES
//#####################################################


//Get movie data
app.get('/movies/:movieId', (req, res) => exceptionHandler.exceptionWrapper(movies.getMovieData, req, res));


//#####################################################
// REVIEWS
//#####################################################


//Get movie reviews
app.get('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(movies.getMovieReviews, req, res));

//Create movie review
app.put('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(movies.createMovieReview, req, res));

//Update movie review
app.patch('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(movies.updateMovieReview, req, res));

//Delete movie review
app.delete('/movies/:movieId/reviews', (req, res) => exceptionHandler.exceptionWrapper(movies.deleteMovieReview, req, res));

module.exports = app;