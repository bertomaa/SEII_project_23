var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
let dbo;
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("easyMovies");
});

getMovieData = async (req, res) => {
    const movieId = req.params.movieId;
    let ret = await adapterGetMovieDetails(movieId);
    res.send(ret)
}

getMovieReviews = async (req, res) => {
    const movieId = req.params.movieId;
    let ret = await adapterGetMovieReviews(movieId);
    res.send(ret)
}

updateMovieReview = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.query.username;
    const title = req.query.title;
    const content = req.query.content;
    const rate = req.query.rate;
    let review = {
        "movieId": req.params.movieId,
        "username": req.query.username,
        "title": req.query.title,
        "content": req.query.content,
        "rate": req.query.rate,
    }
    adapterUpdateReview(review);
}

createMovieReview = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.query.username;
    const title = req.query.title;
    const content = req.query.content;
    const rate = req.query.rate;
    let review = {
        "movieId": req.params.movieId,
        "username": req.query.username,
        "title": req.query.title,
        "content": req.query.content,
        "rate": req.query.rate,
    }
    adapterCreateReview(review);
}

deleteMovieReview = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.query.username;
    adapterDeleteReview(username, movieId);
}

module.exports = {
    getMovieData,
    getMovieReviews,
    createMovieReview,
    updateMovieReview,
    deleteMovieReview
}