const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const dbAdapter = require('../libs/dbAdapter');

getMovieData = async (req, res) => {
    const movieId = req.params.movieId;
    if(dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();
    if(! await dataChecker.existsDBField("Movies", "imdb_title_id", movieId))
        throw new NotFoundException();
    let ret = await adapterGetMovieDetails(movieId);
    res.status(200).send(ret);
}

module.exports = {
    getMovieData
}