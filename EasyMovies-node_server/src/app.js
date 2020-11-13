const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const users = require('./users.js');
const movies = require('./movies.js');

console.log("USING ENVIRONMENT: " + process.env.NODE_ENV);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/profile-images', express.static('public/profile-images'));


app.get('/', (req, res) => {
    res.send("live");
});

//User Register
app.post('/users/register', users.registerUser);

//User Login
app.post('/users/login', users.loginUser);

//Send user profile picture
app.get('/users/:username/profilepic', users.getUserProfilePic);

//Get public user data
app.get('/users/:username', users.getUserDetails);


//#####################################################
// PLAYLISTS
//#####################################################


//Get user playlists
app.get('/users/:username/playlists', users.getPlaylists);

//Add movie to playlist
app.put('/users/:username/playlists/:playlist', users.addMovieToPlaylist);

//Edit playlist name
app.patch('/users/:username/playlists/:playlist', users.editPlaylistName);

//Remove movie from playlist
app.delete('/users/:username/playlists/:playlist', users.removeMovieFromPlaylist);

//Create playlist
app.put('/users/:username/playlists', users.createPlaylist);

//Delete playlist
app.delete('/users/:username/playlists', users.deletePlaylist);


//#####################################################
// MOVIES
//#####################################################


//Get movie data
app.get('/movies/:movieId', movies.getMovieData);


//#####################################################
// REVIEWS
//#####################################################


//Get movie reviews
app.get('/movies/:movieId/reviews', movies.getMovieReviews);

//Create movie review
app.put('/movies/:movieId/reviews', movies.createMovieReview);

//Update movie review
app.patch('/movies/:movieId/reviews', movies.updateMovieReview);

//Delete movie review
app.delete('/movies/:movieId/reviews', movies.deleteMovieReview);


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));