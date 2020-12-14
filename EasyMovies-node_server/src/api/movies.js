const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const dbAdapter = require('../libs/dbAdapter');

getCatalogRoutingV1 = async (req, res) => {
    switch (req.params.catalogName) {
        case "homepage":
            await getHomepageMoviesV1(req, res);
            break;
        default:
            throw new BadRequestException();
    }
}

getCatalogRoutingV2 = async (req, res) => {
    switch (req.params.catalogName) {
        case "homepage":
            await getHomepageMoviesV2(req, res);
            break;
        default:
            throw new BadRequestException();
    }
}

getMovieDataV1 = async (req, res) => {
    const movieId = req.params.movieId;
    if (dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();
    if (! await dataChecker.existsDBField("Movies", "imdb_title_id", movieId))
        throw new NotFoundException();

    let ret = await adapterGetMovieDetailsV1(movieId);
    res.status(200).send(ret);
}


getHomepageMoviesV1 = async (req, res) => {
    let ret = await adapterGetHomepageMoviesV1();
    res.status(200).send(ret);
}

getMovieDataV2 = async (req, res) => {
    const movieId = req.params.movieId;
    if (dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();

    let ret = await adapterGetMovieDetailsV2(movieId);
    res.status(200).send(ret);
}

getHomepageMoviesV2 = async (req, res) => {
    let ret = await adapterGetHomepageMoviesV2();
    res.status(200).send(ret);
}

module.exports = {
    getCatalogRoutingV1,
    getCatalogRoutingV2,
    getMovieDataV1,
    getMovieDataV2,
    getHomepageMoviesV1,
    getHomepageMoviesV2
}