import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Playlist from "./Playlist.js";
import { PlusOutlined } from '@ant-design/icons';
import styles from "./Playlists.module.css";
import { Button, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';


function Playlists() {

  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isNewPlaylistModalVisible, setIsNewPlaylistModalVisible] = useState(false);

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
    setIsLoading(false);
    //loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    /*
      //TODO Get username
      await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists`).then((res)=>{
        setPlaylists(res.data);
        setIsLoading(false);
      });
    */
    setPlaylists([]);
    setIsLoading(false);
  }

  const refreshCallback = () => {
    setIsLoading(true);
    loadPlaylists();
  };

  const newPlaylist = () => {
    if (newPlaylistName && newPlaylistName !== "") {
      /* 
        //TODO get username
        await Axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists`,{ "playlist": newPlaylistName }).then(()=>{
          
          closeModal();
          refreshCallback();
          
        });
      */
      closeModal();
      refreshCallback();
    }
  };

  const closeModal = () => {
    setIsNewPlaylistModalVisible(false);
  };

  return (

    <div className={styles.mainbody}>
      <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <h1 className={styles.title}>My Playlists</h1>
        {!isLoading ?
          <Button icon={<PlusOutlined />} onClick={() => setIsNewPlaylistModalVisible(true)}>New</Button> :
          null
        }
        <Modal title="Create a new playlist"
          visible={isNewPlaylistModalVisible}
          onOk={newPlaylist}
          onCancel={closeModal}>

          <h1>New playlist:</h1>
          <br />
          <Input placeholder="Playlist name" onChange={(v) => setNewPlaylistName(v.target.value)} />

        </Modal>
      </div>

      {!isLoading ?
        (
          playlists.length > 0 ?
            playlists.map((obj) => { return <Playlist playlist={obj} refreshCallback={refreshCallback} /> })
            :
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '500px' }}>
              <h1>No playlists found</h1>
            </div>
        )
        :
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <h1>Loading playlists...</h1>
        </div>}
    </div>

  );

}

export default Playlists;