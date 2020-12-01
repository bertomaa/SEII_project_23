import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import DisplayMovies from '../DisplayMovies/DisplayMovies';
import { Spinner } from 'Components/Commons/Commons';

export default function Homepage() {

    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        Axios.get(`http://localhost:5000/api/v1/catalog/homepage`).then(res => {
            console.log(res.data)
            setMovies(res.data)
            setIsLoading(false)
        })
    }, []);

    return (<>
        {isLoading ? <div style={{paddingTop: "80px", height: "90vh"}}><Spinner size={400} /></div> : <DisplayMovies movies={movies} />}
    </>
    )
}