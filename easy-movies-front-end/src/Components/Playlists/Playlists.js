import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import Playlist from "./Playlist.js";
import { PlusOutlined } from '@ant-design/icons';
import styles from "./Playlists.module.css";
import { Button, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { AuthContext } from '../../App';

function Playlists() {

  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isNewPlaylistModalVisible, setIsNewPlaylistModalVisible] = useState(false);
  const { username, setUsername } = useContext(AuthContext);

  useEffect(async () => {
    await loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists`).then((res) => {
      setPlaylists(res.data);
    })
    .catch(() => setPlaylists([]))
    .finally(() => setIsLoading(false));
  }

  const refreshCallback = () => {
    setIsLoading(true);
    loadPlaylists();
  };

  const newPlaylist = async () => {
    if (newPlaylistName && newPlaylistName !== "") {
      await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists`, { "playlist": newPlaylistName })
      .then(() => {})
      .finally(()=>{
        closeModal();
        refreshCallback();
      });
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