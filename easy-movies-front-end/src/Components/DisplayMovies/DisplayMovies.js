import React, { useEffect, useState } from 'react';
import style from "./DisplayMovies.module.css"
import { Link } from 'react-router-dom';
import ReactImageAppear from 'react-image-appear';
import Axios from 'axios';
import { Spinner } from '../Commons/Commons';
import classNames from 'classnames';
import FlexView from 'react-flexview/lib';
import { MdPlaylistAdd, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { AiFillClockCircle, AiOutlineClockCircle } from 'react-icons/ai';

function Movie(props) {
    const m = props.movie

    const [over, setOver] = useState(false);
    return (
        <Link to={"/MovieDetails/" + m.id} style={{ textDecoration: 'none' }} key={m.id}>
            <div className={style.movieContainer} onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)}>
                <ReactImageAppear
                    src={"https://image.tmdb.org/t/p/w500/" + m.poster_path}
                    animation="zoomIn"
                    animationDuration="0.2s"
                    className={style.poster}
                    showLoader={false}
                />
                <div className={classNames(style.gradient, {[style.gradientActive]: over })}></div>
                <p className={classNames(style.title, { [style.titleActive]: over })}>{m.title}</p>
                <div className={classNames(style.movieActions, { [style.movieActionsActive]: over })}>
                    {m.watchLater ? <AiFillClockCircle className={style.action} /> : <AiOutlineClockCircle className={style.action} onClick={() => { console.log("click") }} />}
                    {m.liked ? <MdFavorite className={style.action} /> : <MdFavoriteBorder className={style.action} />}
                    <MdPlaylistAdd className={style.action} />
                </div>
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