import React, { useState, useEffect, useContext } from 'react';
import style from "./MovieDetails.module.css";
import Axios from 'axios';

export default function MovieDetails({match}) {
    
    var _ = require('lodash');
    
    const [movie, setMovie] = useState({});
    const [trailer, setTrailer] = useState("");
    const [poster, setPoster] = useState("");

    const [isLoadingPoster, setIsLoadingPoster] = useState(true)
    const [isLoadingMovie, setIsLoadingMovie] = useState(true)
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(true)

    useEffect(() => {
        setIsLoadingMovie(true)
        setIsLoadingTrailer(true)
        setIsLoadingPoster(true)
        Axios.get(`http://localhost:5000/api/v1/movies/${match.params.movieId}`).then((res) => {
            console.log("==================================================================================");
            console.log(res);
            let tmp = {};
            tmp.title = _.get(res.data, "title", "Titolo sconosciuto");
            tmp.runtime = _.get(res.data, "runtime", "sconosciuta");
            tmp.release_date = _.get(res.data, "date_published", "sconosciuta");
            tmp.vote_average = _.get(res.data, "vote_average", -1);
            tmp.overview = _.get(res.data, "description", "Trama sconosciuta");
            tmp.genres = _.get(res.data, "genres", []);
            setMovie(tmp)
            setIsLoadingMovie(false)
        }).catch(e=>console.log(e))

        Axios.get(`https://api.themoviedb.org/3/movie/${match.params.movieId}?api_key=${process.env.REACT_APP_API_KEY}&language=ita`).then((res) => {
            setPoster(_.get(res.data, "poster_path"));
            setIsLoadingPoster(false)
        })

        Axios.get(`https://api.themoviedb.org/3/movie/${match.params.movieId}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ita`).then((res) => {
            let data=res.data.results.filter(r=>r.type==="Trailer");
            console.log(res)
            if (data.length>0) {
                setTrailer("https://www.youtube.com/embed/"+data[0].key);
                setIsLoadingTrailer(false);
            }
            console.log(trailer);
            
        })

    }, [match.params.movieId, _]);

    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

    function showDate(date) {
        let index = Number(date.substr(5, 2))
        return date.substr(-2) + " " + mesi[index] + " " + date.substr(0, 4)
    }


    return (
        <>
            <div className={style.container}>
                {!isLoadingTrailer &&
                    <div style={{padding:"0 10vw", marginTop:"20px"}}>
                        <div className={style.videoContainer}>
                            <iframe
                                src={trailer}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                }
                {!isLoadingPoster && !isLoadingMovie &&
                    <div className={style.movie}>
                        <img className={style.poster} src={"https://image.tmdb.org/t/p/original/" + poster} alt={movie.title} />
                        <div className={style.details}>
                            <p className={style.title}>{movie.title}</p>
                            <div className={style.data}>
                                <p>Durata: {movie.runtime} minuti</p>
                                <p>Uscita: {showDate(movie.release_date)}</p>
                            </div>

                            <p className={style.overview}>{movie.overview}</p>
                            <div className={style.genres}>
                                {movie.genres.map(g => { return g.name }).join(", ")}
                            </div>
                        </div>
                    </div>
                }
                </div>
            
        </>
    );
}

