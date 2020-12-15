import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import DisplayMovies from '../DisplayMovies/DisplayMovies';

var _ = require('lodash');

let a = _.debounce((setMovies, setIsLoading, keyword)=> {
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/search/${keyword}`).then((res) => {
        setMovies(res.data);
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