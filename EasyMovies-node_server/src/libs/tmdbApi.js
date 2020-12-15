const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('./exceptionHandler');

const Axios = require("axios").default;

handleError = e => {
    switch (e.response.status) {
        case 404:
            throw new NotFoundException();
        default:
            throw new InternalServerErrorException();
    }
}

getTmdbMovieData = async (movieId) => {
    let movie = await Axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=it-IT`).then((res) => {
        return res.data;
    }).catch(handleError);
    movie.trailer = await Axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}&language=it-IT`).then((res) => {
        let data = res.data.results.filter(r => r.type === "Trailer");
        if (data.length > 0) {
            return "https://www.youtube.com/embed/" + data[0].key;
        }
        return undefined;
    }).catch(handleError);
    return movie;
}

tmdbMovieExists = async (movieId) => {
    return await Axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=it-IT`).then((res) => {
        return true;
    }).catch(handleError);
}

getTmdbHomepageMovies = async () => {
    return await Axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=it-IT&page=1`).then((res) => {
        return res.data;
    }).catch(handleError);
}

module.exports = {
    getTmdbMovieData,
    getTmdbHomepageMovies,
    tmdbMovieExists
}