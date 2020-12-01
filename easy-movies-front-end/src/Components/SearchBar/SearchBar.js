import React from 'react'
import style from "./SearchBar.module.css"

function SearchBar(props) {
    return (
        <input
            className={style.searchBar}
            type="text"
            placeholder={"Type a movie..."}
            
        >
        </input>
    );
}

export default SearchBar;