import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import Playlist from "./Playlist.js";
import { PlusOutlined } from '@ant-design/icons';
import styles from "./Playlists.module.css";
import { Button, Divider, Input, message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { AuthContext } from '../../App';
import { Spinner } from '../Commons/Commons';
import FlexView from 'react-flexview/lib';
import { AiOutlinePlusCircle } from 'react-icons/ai';

function Playlists() {

  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isNewPlaylistModalVisible, setIsNewPlaylistModalVisible] = useState(false);
  const { username } = useContext(AuthContext);

  useEffect(async () => {
    setIsLoading(true);
    await loadPlaylists();
  }, [username]);

  const loadPlaylists = async () => {
    await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists`).then((res) => {
      setPlaylists(res.data);
    })
    .catch(() => setPlaylists([]))
    .finally(() => setIsLoading(false));
  }
  
  const newPlaylist = async () => {
    if (newPlaylistName && newPlaylistName !== "") {
      await Axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists`,{ "playlist": newPlaylistName })
      .then(() => {
        message.success("Playlist creata correttamente");
      })
      .catch(()=>{message.error("Errore creaziona playlist");
      })
      .finally(()=>{
        closeModal();
        refreshCallback();
      });
    }
  };

  const refreshCallback = () => {
    setIsLoading(true);
    loadPlaylists();
  };


  const closeModal = () => {
    setIsNewPlaylistModalVisible(false);
  };

  return (
    username ?
    <div className={styles.mainbody}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <div className={styles.title}>Le mie playlist</div>
        {!isLoading &&
          <AiOutlinePlusCircle className={styles.action} style={{fontSize: "40px", marginTop: "20px" }} onClick={() => setIsNewPlaylistModalVisible(true)}/>
        }
        <Modal title="Crea una nuova playlist"
          visible={isNewPlaylistModalVisible}
          onOk={newPlaylist}
          onCancel={closeModal}>

          <div>Nuova playlist:</div>
          <br />
          <Input placeholder="Nome della playlist" onChange={(v) => setNewPlaylistName(v.target.value)} />

        </Modal>
      </div>

      {!isLoading ?
        (
          playlists.length > 0 ?
            playlists.map((obj) => { return <Playlist key={obj.playlistName} playlist={obj} playlists={playlists} refreshCallback={refreshCallback} /> })
            :
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '500px' }}>
              <div style={{ color: 'white' }}>Nessuna playlist</div>
            </div>
        )
        :
        <div style={{paddingTop: "80px", height: "90vh"}}><Spinner size={400} /></div>}
    </div>
    :
    <FlexView className={styles.mainbody} vAlignContent="center" hAlignContent="center" style={{color: 'white', fontSize: "35px" }}>Non hai effettuato l{'\''}accesso</FlexView>
  );

}

export default Playlists;