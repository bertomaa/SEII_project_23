import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import Slider from "react-slick";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import styles from "./Playlists.module.css";
import { Button, Card, Input } from 'antd';
import { Movie } from '../DisplayMovies/DisplayMovies.js';
import Modal from 'antd/lib/modal/Modal';
import { AuthContext } from '../../App';
import { AiOutlineDelete } from 'react-icons/ai';
import classNames from 'classnames';

const Playlist = ({ playlist, refreshCallback, playlists }) => {
  const [newName, setNewName] = useState("");
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [isDeletePlaylistModalVisible, setIsDeletePlaylistModalVisible] = useState(false);
  const { username } = useContext(AuthContext);

  const slickSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(5, playlist.movies.length),
    slidesToScroll: 5,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: Math.min(4, playlist.movies.length),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: Math.min(3, playlist.movies.length),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(2, playlist.movies.length),
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(1, playlist.movies.length),
          slidesToScroll: 1
        }
      }
    ]
  };

  const deletePlaylist = async () => {
    await Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists`, {data:{ playlist: playlist.playlistName }})
    .then(res => {})
    .finally(() => {
      closeModal();
      refreshCallback();
    });
  }

  const editName = async () => {
    if (newName && newName !== "") {
      await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/playlists/${playlist.playlistName}`, { newName: newName }).then(res => {})
      .finally(()=>{
        closeModal();
        refreshCallback();
      });
    }
  }

  const closeModal = () => {
    setIsEditNameModalVisible(false);
    setIsDeletePlaylistModalVisible(false);
  };

  return (
    <Card style={{ margin: "2vw", borderRadius: "1vw", border:"none", background: "rgba(0,0,0,0.3)"}}>
      <div className={styles.spacedContainer} style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: "35px"}}>{playlist.playlistName}</div>
        <EditOutlined className={styles.editButton}  onClick={() => setIsEditNameModalVisible(true)} />
        <Modal title="Cambia nome playlist"
          visible={isEditNameModalVisible}
          onOk={editName}
          onCancel={closeModal}>
          <div style={{ fontSize: "35px" }}>Nuovo nome:</div>
          <Input placeholder="Nome della playlist" defaultValue={playlist.playlistName} onChange={(v) => setNewName(v.target.value)} />
        </Modal>
        <AiOutlineDelete className={styles.deleteButton} onClick={() => setIsDeletePlaylistModalVisible(true)} />
        <Modal title="Cancella playlist"
          visible={isDeletePlaylistModalVisible}
          onOk={deletePlaylist}
          onCancel={closeModal}
          okText="Si"
        >
          <div style={{ color: 'red', fontSize: "32px"}}>Vuoi cancellare {playlist.playlistName}?</div>
        </Modal>
      </div>
      {
        playlist.movies.length > 0 ?
          <div>
            <Slider {...slickSettings}>
              {playlist.movies.map((obj) => { return <Movie movie={obj} key={obj.id} playlist={playlist.playlistName} refreshCallback={refreshCallback} playlists={playlists}/> })}
            </Slider>
          </div> :
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center', height: "50px"}}>
            <div style={{ color: 'white', fontSize: "20px"}}>
              Nessun film trovato
            </div>
          </div>
      }
    </Card>

  );
}

export default Playlist;

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <Button shape="circle" icon={<ArrowRightOutlined />} onClick={onClick} />
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <Button shape="circle" icon={<ArrowLeftOutlined />} onClick={onClick} />
  );
}