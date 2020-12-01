import React, { useEffect, useState } from 'react';
import style from "./DisplayMovies.module.css"
import { Link } from 'react-router-dom';
import ReactImageAppear from 'react-image-appear';
import Axios from 'axios';

function Movie(props) {
    const m = props.movie

    const [isLoading, setIsLoading] = useState(true);
    const [pathUrl, setPathUrl] = useState("")

    useEffect(() => {
        setIsLoading(true)
        Axios.get(`https://api.themoviedb.org/3/movie/${m.imdb_title_id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`).then(res => {
            setPathUrl(res.data.poster_path);
            setIsLoading(false)
        }).catch(e=>{console.log(m.imdb_title_id)})
    }, []);

    return (
        isLoading ? <div>Loading</div> :
            <Link to={"/MovieDetails/" + m.id} style={{ textDecoration: 'none' }}>
                <div className={style.movieContainer}>
                    <ReactImageAppear
                        src={"https://image.tmdb.org/t/p/w500/" + pathUrl}
                        animation="zoomIn"
                        animationDuration="0.2s"
                        className={style.poster}
                        showLoader={false}
                    />
                    <div className={style.gradient}></div>
                    <p className={style.title}>{m.title}</p>
                </div>
            </Link>
    )
}

export default function DisplayMovies(props) {
    return (
        <div className={style.movies}>
            {props.movies.map(m => <Movie movie={m} key={m.id} />)}
        </div>
    )
}