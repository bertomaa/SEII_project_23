const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const users = require('./users.js');
const movies = require('./movies.js');
const exceptionHandler = require('./exceptionHandler')

console.log("USING ENVIRONMENT: " + process.env.NODE_ENV);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/profile-images', express.static('public/profile-images'));


app.get('/', (req, res) => {
    res.send("live");
});

//User Register
app.post('/users/register', (req, res) => exceptionHandler.exceptionWrapper(users.registerUser, req, res));

//User Login
app.post('/users/login', (req, res) => exceptionHandler.exceptionWrapper(users.loginUser, req, res));

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


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));