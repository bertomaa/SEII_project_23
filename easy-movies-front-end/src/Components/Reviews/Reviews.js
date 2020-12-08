import React, { useState, useEffect } from 'react';
import { Comment, Rate, Avatar, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import FlexView from 'react-flexview';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styles from "./Reviews.module.css";
import Axios from 'axios';
const { TextArea } = Input;

export function TopReviews(props) {

    const [loading, setLoading] = useState(true);

    const [children, setChildren] = useState([])

    useEffect(() => {
        if (loading) {
            children.length = 0;
            Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/movies/${props.movieId}/reviews`).then(res => {
                console.log(res.data)
                res.data.slice(0, 4).forEach((r) => {
                    console.log(r)
                    children.push(<Review review={r} key={r.username} username={r.username} movieId={r.movieId} />);
                });
                const rIndex = children.findIndex((e) => e.username === "aaaa");
                if (rIndex)
                    children.splice(rIndex, 1)
                else
                    children.pop();
                const reviewToAdd = res.data.find((e) => e.username === "aaaa");
                children.push(<Review review={reviewToAdd} username={"aaaa"} movieId={props.movieId} key={"aaaa"} refresh={()=>{setLoading(true)}}/>)
                setLoading(false);
            });
        }
    }, [props.movieId, loading]);

    return (
        <>
            {
                loading ? "loading" : children
            }
        </>
    );
}

export function UserReviews(props) {
    const [loading, setLoading] = useState(true);

    const [children, setChildren] = useState([])

    useEffect(() => {
        if (loading) {
            children.length = 0;
            Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/movies/${props.movieId}/reviews`).then(res => {
                console.log(res.data)
                res.data.forEach((r) => {
                    console.log(r)
                    children.push(<Review review={r} key={r.username} username={r.username} movieId={r.movieId} />);
                });
                const rIndex = children.findIndex((e) => e.username === "aaaa");
                if (rIndex)
                    children.splice(rIndex, 1)
                else
                    children.pop();
                const reviewToAdd = res.data.find((e) => e.username === "aaaa");
                children.splice(0, 0, <Review review={reviewToAdd} username={"aaaa"} movieId={props.movieId} key={"aaaa"} refresh={()=>{setLoading(true)}}/>)
                setLoading(false);
            });
        }
    }, [props.movieId, loading]);

    return (
        <>
            {
                loading ? "loading" : children
            }
        </>
    );
}

const Review = (props) => {
    const username = props.username;
    const movieId = props.movieId;
    const [editing, setEditing] = useState(!props.review);
    const create = !props.review;
    const [review, setReview] = useState(props.review ? props.review : {
        rate: undefined,
        content: "",
        title: ""
    })
    return (
        <Comment
            author={<Link to={"/users/" + username} key={username} style={{ fontSize: "18px" }}>{username}</Link>}
            avatar={
                <Avatar
                    src={`${process.env.REACT_APP_API_BASE_URL}/profile-images/${username}.jpg`}
                />
            }
            content={editing ?
                <FlexView column style={{ padding: "10px" }}>
                    <Input
                        onChange={(e) => { setReview({ ...review, "title": e.target.value }) }}
                        style={{ width: "50%", marginBottom: "10px" }}
                        defaultValue={review.title}

                    ></Input>
                    <TextArea
                        onChange={(e) => { setReview({ ...review, "content": e.target.value }) }}
                        style={{ marginBottom: "10px" }}
                        defaultValue={review.content}
                    ></TextArea>
                    <Button
                        disabled={!(review.title !== "" && review.content !== "" && review.rate)}
                        type="primary"
                        onClick={() => {
                            console.log("🚀 ~ file: Reviews.js ~ line 38 ~ Review ~ create", create);
                            if (create)
                                onCreateReview(review, username, movieId, props.refresh)
                            else
                                onUpdateReview(review, username, movieId, props.refresh);
                            setEditing(false);
                            console.log(review);
                        }}
                        style={{ width: "100px", alignSelf: "flex-end" }}
                    >Salva</Button>
                </FlexView>
                :
                <FlexView column>
                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>{review.title}</div>
                    <p>{review.content}</p>
                </FlexView>
            }
            datetime={
                <FlexView style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Rate disabled={!editing} allowHalf onChange={(e) => { setReview({ ...review, rate: e }) }} value={review.rate} />
                    {!editing && <EditOutlined onClick={() => { setEditing(true) }} style={{ fontSize: "20px", marginLeft: "15px" }} className={styles.editButton} />}
                    {!editing && <DeleteOutlined onClick={() => { onDeleteReview(username, movieId, props.refresh); }} style={{ fontSize: "20px", marginLeft: "15px" }} className={styles.deleteButton} />}
                </FlexView>
            }
        />
    );
}

const onCreateReview = (review, username, movieId, callBack) => {
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/login`, {
        "username": "aaaa",
        "password": "aaaa"
    }, {
    })
    Axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v2/movies/${movieId}/reviews`, {
        "title": review.title,
        "content": review.content,
        "username": username,
        "movieId": movieId,
        "rate": review.rate,
    }).then(() => { message.success("Review creata correttamente") }).catch(() => { message.error("Si è verificato un errore durante la creazione della review") }).then(callBack);
}

const onDeleteReview = (username, movieId, callBack) => {
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/login`, {
        "username": "aaaa",
        "password": "aaaa"
    }, {
    })
    Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v2/movies/${movieId}/reviews`, {
        data: {
            "username": username,
            "movieId": movieId,
        },
    }).then(() => { message.success("Review cancellata correttamente") }).catch(() => { message.error("Si è verificato un errore durante la cancellazione della review") }).then(callBack);
}

const onUpdateReview = (review, username, movieId, callBack) => {
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/login`, {
        "username": "aaaa",
        "password": "aaaa"
    }, {
    })
    Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/v2/movies/${movieId}/reviews`, {
        "title": review.title,
        "content": review.content,
        "username": username,
        "movieId": movieId,
        "rate": review.rate,
    }).then(() => { message.success("Review modificata correttamente") }).catch(() => { message.error("Si è verificato un errore durante la modifica della review") }).then(callBack);
}
