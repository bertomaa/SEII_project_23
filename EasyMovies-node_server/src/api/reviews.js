const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const dbAdapter = require('../libs/dbAdapter');

getMovieReviews = async (req, res) => {
    const movieId = req.params.movieId;
    if (dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();
    if (! await dataChecker.existsDBField("Movies", "imdb_title_id", movieId))
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
    if (dataChecker.checkFieldsNull([movieId, username, title, content, rate]))
        throw new BadRequestException();
    if (!(await dataChecker.checkUsername(username) && await dataChecker.existsDBField("Movies", "imdb_title_id", movieId)))
        throw new NotFoundException();
    if (!(await dataChecker.existsDBFields("Reviews", { "movieId": movieId, "username": username, })))
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
    if (dataChecker.checkFieldsNull([movieId, username, title, content, rate]) || rate > 10 || rate < 0)
        throw new BadRequestException();
    if (!(await dataChecker.checkUsername(username) && await dataChecker.existsDBField("Movies", "imdb_title_id", movieId)))
        throw new NotFoundException();
    if (await dataChecker.existsDBFields("Reviews", { "movieId": movieId, "username": username, }))
        throw new ConflictException();
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
    const username = req.body.username;
    if (dataChecker.checkFieldsNull([movieId, username]))
        throw new BadRequestException();
    if (!(await dataChecker.checkUsername(username) && await dataChecker.existsDBField("Movies", "imdb_title_id", movieId)))
        throw new NotFoundException();
    if (!(await dataChecker.existsDBFields("Reviews", { "movieId": movieId, "username": username, })))
        throw new NotFoundException();
    let ret = await adapterDeleteReview(username, movieId);
    res.status(200).send(ret);
}

getUserReviews = async (req, res) => {
    const username = req.params.username;
    if(dataChecker.checkFieldsNull([username]))
        throw new BadRequestException();
    if(! await dataChecker.existsDBField("Users", "username", username))
        throw new NotFoundException();
    let ret = await adapterGetUserReviews(username);
    res.status(200).send(ret)
}


module.exports = {
    getMovieReviews,
    createMovieReview,
    updateMovieReview,
    deleteMovieReview,
    getUserReviews
}