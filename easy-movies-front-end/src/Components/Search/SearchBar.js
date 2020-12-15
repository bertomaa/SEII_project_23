import React from 'react';
import style from "./SearchBar.module.css";
import classNames from 'classnames';
import {
    useHistory
} from "react-router-dom";

function SearchBar(props) {
    let history = useHistory();

    return (
        <input
            className={classNames(style.searchBar, {[style.searchBarMobile]: props.mobile})}
            type="text"
            placeholder="Type a movie..."
            onChange={(e) => { props.onChange(e.target.value) }}
            onClick={() => { history.push("/search") }}
        >
        </input>
    );
}

export default SearchBar;