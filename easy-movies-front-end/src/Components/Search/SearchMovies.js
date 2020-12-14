import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import DisplayMovies from '../DisplayMovies';

var _ = require('lodash');

let a = _.debounce((setMovies, setIsLoading, keyword)=> {
    Axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${keyword}&page=1&include_adult=false&language=it-IT`).then((res) => {
        setMovies(res.data.results);
        setIsLoading(false);
    });
}, 300);

function SearchMovies(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [hasKeyword, setHasKeyword] = useState(false);
    

    useEffect(() => {
        if (props.keyword === "") {
            setIsLoading(false);
            setHasKeyword(false);
            return;
        }
        setIsLoading(true);
        setHasKeyword(true);
        a(setMovies, setIsLoading, props.keyword);
    }, [props.keyword]);

    return (
        <>
            {hasKeyword ? (
                isLoading ? <h1>Loading...</h1> : <DisplayMovies movies={movies} />)
                :
                <p>.</p>
            }
        </>
    );
}

export default SearchMovies;