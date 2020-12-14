import React from 'react'
import style from "../modules.css/SearchBar.module.css"
import {
    useHistory
} from "react-router-dom";

function SearchBar(props) {
    let history = useHistory();


    return (
        <input
            className={style.searchBar}
            type="text"
            placeholder="Type a movie..."
            onChange={(e) => { props.onChange(e.target.value) }}
            onClick={() => { history.push("/search") }}
        >
        </input>
    );
}

export default SearchBar;