const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const dbAdapter = require('../libs/dbAdapter');
const tmdbApi = require('../libs/tmdbApi');

getMovieReviewsV1 = async (req, res) => {
    const movieId = req.params.movieId;
    if (dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();
    if (! await dataChecker.existsDBField("Movies", "imdb_title_id", movieId))
        throw new NotFoundException();
    let ret = await adapterGetMovieReviews(movieId);
    res.status(200).send(ret)
}

updateMovieReviewV1 = async (req, res) => {
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

createMovieReviewV1 = async (req, res) => {
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

deleteMovieReviewV1 = async (req, res) => {
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

getMovieReviewsV2 = async (req, res) => {
    const movieId = req.params.movieId;
    if (dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();
    if (! await tmdbApi.tmdbMovieExists(movieId))
        throw new NotFoundException();
    let ret = await adapterGetMovieReviews(movieId);
    res.status(200).send(ret)
}

updateMovieReviewV2 = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.body.username;
    const title = req.body.title;
    const content = req.body.content;
    const rate = req.body.rate;
    if (dataChecker.checkFieldsNull([movieId, username, title, content, rate]))
        throw new BadRequestException();
    if (!(await dataChecker.checkUsername(username) && await tmdbApi.tmdbMovieExists(movieId)))
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

createMovieReviewV2 = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.body.username;
    const title = req.body.title;
    const content = req.body.content;
    const rate = req.body.rate;
    if (dataChecker.checkFieldsNull([movieId, username, title, content, rate]) || rate > 10 || rate < 0)
        throw new BadRequestException();
    if (!(await dataChecker.checkUsername(username) && await tmdbApi.tmdbMovieExists(movieId)))
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

deleteMovieReviewV2 = async (req, res) => {
    const movieId = req.params.movieId;
    const username = req.body.username;
    if (dataChecker.checkFieldsNull([movieId, username]))
        throw new BadRequestException();
    if (!(await dataChecker.checkUsername(username) && await tmdbApi.tmdbMovieExists(movieId)))
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
    let reviews = await adapterGetUserReviews(username);

    if (!reviews)
        throw new NotFoundException();
    for await (let r of reviews) {
        r.movieDetails = await adapterGetMovieDetailsV2(r.movieId);
    };
    res.status(200).send(reviews)
}


module.exports = {
    getMovieReviewsV1,
    createMovieReviewV1,
    updateMovieReviewV1,
    deleteMovieReviewV1,
    getMovieReviewsV2,
    createMovieReviewV2,
    updateMovieReviewV2,
    deleteMovieReviewV2,
    getUserReviews
}