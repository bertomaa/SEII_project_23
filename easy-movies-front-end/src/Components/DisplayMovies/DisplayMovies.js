import React, { useEffect, useState } from 'react';
import style from "./DisplayMovies.module.css"
import { Link } from 'react-router-dom';
import ReactImageAppear from 'react-image-appear';
import classNames from 'classnames';
import { MdPlaylistAdd, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { AiFillClockCircle, AiOutlineClockCircle } from 'react-icons/ai';
import { CgPlayListRemove } from 'react-icons/cg';
import Modal from 'antd/lib/modal/Modal';
import { Button } from 'antd';

export function Movie(props) {
    const [showPlaylistSelectModal, setShowPlaylistSelectModal] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const m = props.movie;

    const isFromPlaylist = props.playlist && props.refreshCallback;

    useEffect(async () => {
        //TODO delete this
        setPlaylists([
            {
                "playlistName": "tp",
                "movies": [
                    {
                        "adult": false,
                        "backdrop_path": "/jeAQdDX9nguP6YOX6QSWKDPkbBo.jpg",
                        "genre_ids": [
                            28,
                            14,
                            878
                        ],
                        "id": 590706,
                        "original_language": "en",
                        "original_title": "Jiu Jitsu",
                        "overview": "Ogni sei anni, un antico ordine di esperti combattenti di Jiu Jitsu devono affrontare una feroce razza di invasori alieni in una battaglia per difendere la Terra. Per migliaia di anni, le forze che hanno protetto la Terra hanno ottenuto la vittoria... Fino ad ora.",
                        "popularity": 3199.491,
                        "poster_path": "/eLT8Cu357VOwBVTitkmlDEg32Fs.jpg",
                        "release_date": "2020-11-20",
                        "title": "Jiu Jitsu",
                        "video": false,
                        "vote_average": 5.7,
                        "vote_count": 127
                    },
                    {
                        "adult": false,
                        "backdrop_path": "/ckfwfLkl0CkafTasoRw5FILhZAS.jpg",
                        "genre_ids": [
                            28,
                            35,
                            14
                        ],
                        "id": 602211,
                        "original_language": "en",
                        "original_title": "Fatman",
                        "overview": "",
                        "popularity": 2504.473,
                        "poster_path": "/4n8QNNdk4BOX9Dslfbz5Dy6j1HK.jpg",
                        "release_date": "2020-11-13",
                        "title": "Fatman",
                        "video": false,
                        "vote_average": 6.1,
                        "vote_count": 128
                    }
                ]
            },
            {
                "playlistName": "tp1",
                "movies": [
                ]
            },
            {
                "playlistName": "tp2",
                "movies": [
                    {
                        "adult": false,
                        "backdrop_path": "/jeAQdDX9nguP6YOX6QSWKDPkbBo.jpg",
                        "genre_ids": [
                            28,
                            14,
                            878
                        ],
                        "id": 590706,
                        "original_language": "en",
                        "original_title": "Jiu Jitsu",
                        "overview": "Ogni sei anni, un antico ordine di esperti combattenti di Jiu Jitsu devono affrontare una feroce razza di invasori alieni in una battaglia per difendere la Terra. Per migliaia di anni, le forze che hanno protetto la Terra hanno ottenuto la vittoria... Fino ad ora.",
                        "popularity": 3199.491,
                        "poster_path": "/eLT8Cu357VOwBVTitkmlDEg32Fs.jpg",
                        "release_date": "2020-11-20",
                        "title": "Jiu Jitsu",
                        "video": false,
                        "vote_average": 5.7,
                        "vote_count": 127
                    },
                    {
                        "adult": false,
                        "backdrop_path": "/ckfwfLkl0CkafTasoRw5FILhZAS.jpg",
                        "genre_ids": [
                            28,
                            35,
                            14
                        ],
                        "id": 602211,
                        "original_language": "en",
                        "original_title": "Fatman",
                        "overview": "",
                        "popularity": 2504.473,
                        "poster_path": "/4n8QNNdk4BOX9Dslfbz5Dy6j1HK.jpg",
                        "release_date": "2020-11-13",
                        "title": "Fatman",
                        "video": false,
                        "vote_average": 6.1,
                        "vote_count": 128
                    }
                ]
            }
        ]);
        //loadPlaylists();
        setIsLoading(false);
    }, []);

    const deleteMovieFromPlaylist = async () => {
        /*
            //TODO get username
            await Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists/${playlist}`,{ "movieId": m.id }).then(res=>{
                refreshCallback();
            });
        */
    }

    const addMovieToPlaylist = async (playlistName) => {
        /*
            //TODO get username
            await Axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists/${playlistName}`,{ "movieId": m.id }).then(res=>{});
        */
    }

    const loadPlaylists = async () => {
        /*
          //TODO Get username
          await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists`).then((res)=>{
            setPlaylists(res.data);
          });
        */
        setPlaylists([]);
        setIsLoading(false);
    }

    const closeModal = () => {
        setShowPlaylistSelectModal(false);
    }

    const [over, setOver] = useState(false);
    return (

        <div className={style.movieContainer} onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)}>
            <Link to={"/MovieDetails/" + m.id} style={{ textDecoration: 'none' }} key={m.id}>
                {
                    m.poster_path ?
                        <ReactImageAppear
                            src={"https://image.tmdb.org/t/p/w500/" + m.poster_path}
                            animation="zoomIn"
                            animationDuration="0.2s"
                            className={style.poster}
                            showLoader={false}
                        /> :
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: "450px" }}>
                            No cover image
                    </div>
                }
                <div className={classNames(style.gradient, { [style.gradientActive]: over })}></div>
                <p className={classNames(style.title, { [style.titleActive]: over })}>{m.title}</p>
            </Link>
            <div className={classNames(style.movieActions, { [style.movieActionsActive]: over })}>
                {m.watchLater ? <AiFillClockCircle className={style.action} /> : <AiOutlineClockCircle className={style.action} onClick={() => { console.log("click") }} />}
                {m.liked ? <MdFavorite className={style.action} /> : <MdFavoriteBorder className={style.action} />}
                <MdPlaylistAdd className={style.action} onClick={() => setShowPlaylistSelectModal(true)} />
                {isFromPlaylist ? <CgPlayListRemove className={style.action} onClick={deleteMovieFromPlaylist} /> : null}
            </div>
            <Modal title="Add movie to playlist"
                visible={showPlaylistSelectModal}
                onOk={closeModal}
                onCancel={closeModal}
            >
                <h1>Add movie to:</h1>
                {
                    isLoading ? null : (
                        playlists.length > 0 ?
                            playlists.map((obj) => { return <><Button style={{ marginBottom: "10px" }} onclick={() => addMovieToPlaylist(obj.playlistName)}>{obj.playlistName}</Button> <br /> </> })
                            :
                            <h2>No playlists found</h2>
                    )
                }
            </Modal>
        </div>
    )
}

export default function DisplayMovies(props) {
    return (
        <div className={style.movies}>
            {props.movies.map(m => <Movie movie={m} key={m.id} />)}
        </div>
    )
}