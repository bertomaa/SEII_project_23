import { React, useState, useEffect } from 'react'
import Avatar from 'antd/lib/avatar/avatar';
import FlexView from 'react-flexview/lib';
import Axios from 'axios';
import { Spinner } from '../Commons/Commons';
import {Divider} from 'antd';
import { UserReviews } from '../Reviews/Reviews';
import styles from './UserProfile.module.css'

export function UserProfile({ match }) {
    const username = match.params.username;
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState()
    const [surname, setSurname] = useState()
    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}`).then(res => {
            setName(res.data.name);
            setSurname(res.data.surname);
            setLoading(false)
        })
    }, [username]);
    return (
       <FlexView style={{justifyContent: "center"}}>
            <div style={{position: "relative", maxWidth: "1000px", width: "70vw"}}>
                {
                    loading ? <Spinner /> :
                    <FlexView column style={{ paddingTop: "150px"}}>
                        <FlexView hAlignContent="center" style={{marginBottom: "40px"}}>
                            <Avatar
                            className={styles.image}
                                shape={"square"}
                                style={{ width: "30vw", height: "30vw", borderRadius: "4vw" }}
                                src={`${process.env.REACT_APP_API_BASE_URL}/profile-images/${username}.jpg`}
                            />
                            <FlexView column hAlignContent="left" style={{fontSize: "50px", marginLeft: "2vw", color: "white", justifyContent: "space-evenly"}} >
                                <div>{username}</div>
                                <Divider style={{backgroundColor: "white"}}/>
                                <div>
                                    <div>{name}</div>
                                    <div>{surname}</div>
                                </div>
                            </FlexView>
                        </FlexView>
                        <UserReviews user={username}/>
                    </FlexView>
                }
            </div>
       </FlexView>
    );
}