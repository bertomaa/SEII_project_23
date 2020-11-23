const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const dbAdapter = require('../libs/dbAdapter');

getCatalogRouting = async (req,res) => {
    switch(req.params.catalogName) {
        case "homepage":
            await getHomepageMovies(req,res);
            break;
        default: 
            throw new BadRequestException();
    }
}

getMovieData = async (req, res) => {
    const movieId = req.params.movieId;
    if(dataChecker.checkFieldsNull([movieId]))
        throw new BadRequestException();
    if(! await dataChecker.existsDBField("Movies", "imdb_title_id", movieId))
        throw new NotFoundException();
        
    let ret = await adapterGetMovieDetails(movieId);
    res.status(200).send(ret);
}

getHomepageMovies = async (req, res) => {        
    let ret = await adapterGetHomepageMovies();
    res.status(200).send(ret);
}

module.exports = {
    getCatalogRouting,
    getMovieData,
    getHomepageMovies
}