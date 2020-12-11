import React, { useEffect, useState } from 'react';
import style from "./DisplayMovies.module.css"
import { Link } from 'react-router-dom';
import ReactImageAppear from 'react-image-appear';
import classNames from 'classnames';
import { MdPlaylistAdd, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { AiFillClockCircle, AiOutlineClockCircle } from 'react-icons/ai';
import {CgPlayListRemove} from 'react-icons/cg';
import Modal from 'antd/lib/modal/Modal';

export function Movie(props) {
    const [showPlaylistSelectModal, setShowPlaylistSelectModal] = useState(false);

    const m = props.movie;

    const isFromPlaylist=props.playlist&&props.refreshCallback;

    const deleteMovieFromPlaylist = async () => { 
        /*
            //TODO get username
            await Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists/${playlist}`,{ "movieId": m.id }).then(res=>{
                refreshCallback();
            });
        */
    }

    const closeModal = () => {
        setShowPlaylistSelectModal(false);
    }

    const [over, setOver] = useState(false);
    return (
        <Link to={"/MovieDetails/" + m.id} style={{ textDecoration: 'none' }} key={m.id}>
            <div className={style.movieContainer} onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)}>
                {
                m.poster_path ?
                    <ReactImageAppear
                    src={"https://image.tmdb.org/t/p/w500/" + m.poster_path}
                    animation="zoomIn"
                    animationDuration="0.2s"
                    className={style.poster}
                    showLoader={false}
                /> :
                <div style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: "450px"}}>
                    No cover image
                </div>
                }
                <div className={classNames(style.gradient, { [style.gradientActive]: over })}></div>
                <p className={classNames(style.title, { [style.titleActive]: over })}>{m.title}</p>
                <div className={classNames(style.movieActions, { [style.movieActionsActive]: over })}>
                    {m.watchLater ? <AiFillClockCircle className={style.action} /> : <AiOutlineClockCircle className={style.action} onClick={() => { console.log("click") }} />}
                    {m.liked ? <MdFavorite className={style.action} /> : <MdFavoriteBorder className={style.action} />}
                    <MdPlaylistAdd className={style.action} onClick={()=>setShowPlaylistSelectModal(true)}/>
                    {isFromPlaylist ? <CgPlayListRemove className={style.action} onClick={deleteMovieFromPlaylist}/> : null}
                </div>
                <Modal title="Add movie to playlist"
                    visible={showPlaylistSelectModal}
                    onOk={closeModal}>
                    
                    <h1>Add movie to:</h1>
                    {/*TODO*/}
                </Modal>
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