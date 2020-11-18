const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const dbAdapter = require('../libs/dbAdapter');

getMovieReviews = async (req, res) => {
    const movieId = req.params.movieId;
    if(dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();
    if(! await dataChecker.existsDBField("Movies", "imdb_title_id", movieId))
        throw new NotFoundException();
    let ret = await adapterGetMovieReviews(movieId);
    res.status(200).send(ret)
}

updateMovieReview = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.body.username;
    const title = req.body.title;
    const content = req.body.content;
    const rate = req.body.rate;
    if(dataChecker.checkFieldsNull([movieId, username, title, content, rate]))
        throw new BadRequestException();
    if(!( await dataChecker.checkUsername(username) && await dataChecker.existsDBField("Movies", "imdb_title_id", movieId)))
        throw new NotFoundException();
    let review = {
        "movieId": movieId,
        "username": username,
        "title": title,
        "content": content,
        "rate": rate,
    }
    let ret = await adapterUpdateReview(review);
    res.status(200).send(ret);
}

createMovieReview = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.body.username;
    const title = req.body.title;
    const content = req.body.content;
    const rate = req.body.rate;
    if(dataChecker.checkFieldsNull([movieId, username, title, content, rate]))
        throw new BadRequestException();
    if(!( await dataChecker.checkUsername(username) && await dataChecker.existsDBField("Movies", "imdb_title_id", movieId)))
        throw new NotFoundException();
    let review = {
        "movieId": movieId,
        "username": username,
        "title": title,
        "content": content,
        "rate": rate,
    }
    let ret = await adapterCreateReview(review);
    res.status(201).send(ret);
}

deleteMovieReview = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.query.username;
    if(dataChecker.checkFieldsNull([movieId, username]))
        throw new BadRequestException();
    if(!( await dataChecker.checkUsername(username) && await dataChecker.existsDBField("Movies", "imdb_title_id", movieId)))
        throw new NotFoundException();
        let ret = await adapterDeleteReview(review);
        res.status(201).send(ret)
}

module.exports = {
    getMovieReviews,
    createMovieReview,
    updateMovieReview,
    deleteMovieReview
}