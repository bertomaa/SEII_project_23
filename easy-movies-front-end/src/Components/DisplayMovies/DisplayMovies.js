import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import style from "./DisplayMovies.module.css"
import { Link } from 'react-router-dom';
import ReactImageAppear from 'react-image-appear';
import classNames from 'classnames';
import { MdPlaylistAdd, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { AiFillClockCircle, AiOutlineClockCircle } from 'react-icons/ai';
import { CgPlayListRemove } from 'react-icons/cg';
import { Button, Popover, Checkbox, Divider } from 'antd';
import { AuthContext } from '../../App';
import { Spinner } from '../Commons/Commons';

export function Movie(props) {
    const watchLaterText = "Guarda più tardi";
    const likedText = "Piaciuti";

    const [showPlaylistSelectModal, setShowPlaylistSelectModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [watchLater, setWatchLater] = useState(false);

    const { username } = useContext(AuthContext);

    const m = props.movie;

    const isFromPlaylist = props.playlist && props.refreshCallback;

    useEffect(() => {
        for (let pl1 in props.playlists) {
            let pl = props.playlists[pl1];
            if (pl.playlistName == watchLaterText) {
                for (let mv1 in pl.movies) {
                    let mv = pl.movies[mv1];
                    if (mv.id == m.id) {
                        setWatchLater(true);
                    }
                }
            }
            if (pl.playlistName == likedText) {
                for (let mv1 in pl.movies) {
                    let mv = pl.movies[mv1];
                    if (mv.id == m.id) {
                        setLiked(true);
                    }
                }
            }
        }
        setIsLoading(false);
    }, []);

    const deleteMovieFromPlaylist = async (playlistName) => {
        let pname;
        if (playlistName === undefined) {
            pname = props.playlist;
        } else {
            pname = playlistName;
        }
        await Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists/${pname}`, { data: { movieId: m.id.toString() } }).then(res => {
            
        });
    }

    const addMovieToPlaylist = async (playlistName) => {
        await Axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists/${playlistName}`, { movieId: m.id.toString() }).then(res => {
            
        });
    }

    const createPlaylist = async (pname) => {
        await Axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists`, { "playlist": pname })
            .then(() => { })
            .finally(() => {
                closeModal();
            });
    };

    const closeModal = () => {
        setShowPlaylistSelectModal(false);
    }

    const playlistContainsMovie = (playl) => {
        for (let pl1 in props.playlists) {
            let pl = props.playlists[pl1];
            if (pl.playlistName == playl) {
                for (let mv1 in pl.movies) {
                    let mv = pl.movies[mv1];
                    if (mv.id == m.id) {
                        return true;
                    }
                }
                return false;
            }
        }
    }

    const accountPopover = (
        <>
            <div style={{ fontSize: "20px" }}>Aggiungi film a:</div>
            <Divider/>
            {
                isLoading ? null : (
                    props.playlists.length > 0 ?
                        <>
                        {props.playlists.map((obj) => { return <><Checkbox 
                            style={{ marginBottom: "10px" }}
                            onChange={(e)=>{if(e.target.checked){addMovieToPlaylist(obj.playlistName)}else{deleteMovieFromPlaylist(obj.playlistName)}}}
                            defaultChecked={playlistContainsMovie(obj.playlistName)}>{obj.playlistName}
                            </Checkbox><br/></> })}
                            <Button onClick={()=>{if(isFromPlaylist){props.refreshCallback()}}}>Salva</Button>
                        </>
                        :
                        <div style={{ fontSize: "20px" }}>Nessuna playlist</div>
                )
            }
        </>
    );

    const [over, setOver] = useState(false);
    return (

        <div className={style.movieContainer} onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)}>
            <Link to={"/movies/" + m.id} style={{ textDecoration: 'none' }} key={m.id}>
                {
                    m.poster_path ?
                        <ReactImageAppear
                            src={"https://image.tmdb.org/t/p/w500/" + m.poster_path}
                            animation="zoomIn"
                            animationDuration="0.2s"
                            className={style.poster}
                            showLoader={false}
                        /> :
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: "450px", color: "blue" }}>
                            No immagine di copertina
                    </div>
                }
                <div className={classNames(style.gradient, { [style.gradientActive]: over })}></div>
                <div style={{ marginBottom: "40px" }} className={classNames(style.title, { [style.titleActive]: over })}>{m.title}</div>
            </Link>
            {
                username ? <div className={classNames(style.movieActions, { [style.movieActionsActive]: over })}>
                    {watchLater ? <AiFillClockCircle className={style.action} onClick={() => { deleteMovieFromPlaylist(watchLaterText); setWatchLater(false) }} /> :
                        <AiOutlineClockCircle className={style.action} onClick={() => { createPlaylist(watchLaterText).catch(() => { }).finally(() => { addMovieToPlaylist(watchLaterText); setWatchLater(true) }) }} />}
                    {liked ? <MdFavorite className={style.action} onClick={() => { deleteMovieFromPlaylist(likedText); setLiked(false) }} /> :
                        <MdFavoriteBorder className={style.action} onClick={() => { createPlaylist(likedText).catch(() => { }).finally(() => { addMovieToPlaylist(likedText); setLiked(true) }) }} />}
                    <Popover content={accountPopover}>
                        <MdPlaylistAdd className={style.action} />
                    </Popover>
                    {isFromPlaylist ? <CgPlayListRemove className={style.action} onClick={async () => {deleteMovieFromPlaylist().then(()=>props.refreshCallback())}} /> : null}
                </div> : null
            }


        </div>
    )
}

export default function DisplayMovies(props) {
    const { username } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadPlaylists = async () => {
        await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists`).then((res) => {
            setPlaylists(res.data);
        })
            .catch(() => { });
    }

    useEffect(async () => {
        if (username) {
            await loadPlaylists().then(() => { }).finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        isLoading ? <div style={{paddingTop: "80px", height: "90vh"}}><Spinner size={400} /></div> :
            <div className={style.movies}>
                {props.movies.map(m => <Movie playlists={playlists} movie={m} key={m.id} />)}
            </div>
    )
}