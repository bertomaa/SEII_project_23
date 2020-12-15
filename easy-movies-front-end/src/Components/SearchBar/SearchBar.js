import classNames from 'classnames';
import React from 'react'
import styles from "./SearchBar.module.css"

function SearchBar(props) {
    return (
        <input
            className={classNames(styles.searchBar, {[styles.searchBarMobile]: props.mobile})}
            type="text"
            placeholder={"Type a movie..."}
            
        >
        </input>
    );
}

export default SearchBar;