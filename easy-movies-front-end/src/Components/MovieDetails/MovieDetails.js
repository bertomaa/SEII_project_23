import React, { useState, useEffect, useContext } from 'react'
import style from "./MovieDetails.module.css"

export default function MovieDetails() {

    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

    function showDate(date) {
        let index = Number(date.substr(5, 2))
        return date.substr(-2) + " " + mesi[index] + " " + date.substr(0, 4)
    }

    let trailer = "https://www.youtube.com/embed/Pn0Q4BpYN7c";
    let movie = {
        title: "Tenet",
        poster_path: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/iKXqUiLFDgeIGozRR6JYRvFmD5A.jpg",
        runtime: "150",
        release_date: "2020-08-26",
        vote_average: "7,5",
        overview: "Il tempo per il nostro mondo sta per scadere, ed alcuni agenti entrano in azione per evitare un evento più catastrofico di una terza Guerra Mondiale o di un Olocausto nucleare. Tenet aprirà le porte giuste – e anche alcune sbagliate – per guardare il mondo con occhi nuovi, sentendolo anziché tentare di comprenderlo…",
        genres: [{name: "Azione"},{name:  "Thriller"},{name:  "Fantascienza"}]
    };

    return (
        <>
            {
                <div className={style.container}>
                    {
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
                    <div className={style.movie}>
                        <img className={style.poster} src={"https://image.tmdb.org/t/p/original/" + movie.poster_path} alt={movie.title} />
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
                </div>
            }
        </>
    );
}

