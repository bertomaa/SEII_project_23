import React, { useEffect, useState } from 'react';
import style from "./DisplayMovies.module.css"
import { Link } from 'react-router-dom';
import ReactImageAppear from 'react-image-appear';
import Axios from 'axios';
import { Spinner } from '../Commons/Commons';
import classNames from 'classnames';

function Movie(props) {
    const m = props.movie
    return (
        <Link to={"/MovieDetails/" + m.id} style={{ textDecoration: 'none' }} key={m.id}>
            <div className={style.movieContainer}>
                {/* <img
                    className={style.poster}
                    src={"https://image.tmdb.org/t/p/w500/" + m.poster_path}
                    alt={m.title}
                /> */}
                <ReactImageAppear
                    src={"https://image.tmdb.org/t/p/w500/" + m.poster_path}
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