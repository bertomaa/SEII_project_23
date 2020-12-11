import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Slider from "react-slick";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import styles from "./Playlists.module.css";
import { Button, Input } from 'antd';
import { Movie } from '../DisplayMovies/DisplayMovies.js';
import Modal from 'antd/lib/modal/Modal';



const Playlist = ({ playlist, refreshCallback }) => {
  const [newName, setNewName] = useState("");
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [isDeletePlaylistModalVisible, setIsDeletePlaylistModalVisible] = useState(false);

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
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, playlist.movies.length),
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(1, playlist.movies.length),
          slidesToScroll: 1
        }
      }
    ]
  };
  
  const deletePlaylist = () => {
    /*
      //TODO Get username
      await Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists`,{ "playlist": playlist.playlistName }).then(res=>{
        closeModal();
        refreshCallback();
      });
    */
    closeModal();
    refreshCallback();
  }
  
  const editName = () => {
    if (newName && newName !== "") {
      /*
      //TODO Get username
      await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/v2/${username}/playlists/${playlist.playlistName}`,{ "newName": newName }).then(res=>{
        closeModal();
        refreshCallback();
      });
      */
      closeModal();
      refreshCallback();
    }
  }

  const closeModal = () => {
    setIsEditNameModalVisible(false);
    setIsDeletePlaylistModalVisible(false);
  };

  return (
    <div>
      <div className={styles.spacedContainer} style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <h1>{playlist.playlistName}</h1>
        <Button shape="circle" icon={<EditOutlined />} onClick={()=>setIsEditNameModalVisible(true)} />
        <Modal title="Edit Playlist Name"
          visible={isEditNameModalVisible}
          onOk={editName}
          onCancel={closeModal}>
          <h1>New name:</h1>
          <br />
          <Input placeholder="Playlist name" defaultValue={playlist.playlistName} onChange={(v) => setNewName(v.target.value)} />
        </Modal>
        <Button shape="circle" icon={<DeleteOutlined />} onClick={()=>setIsDeletePlaylistModalVisible(true)} />
        <Modal title="Delete Playlist"
          visible={isDeletePlaylistModalVisible}
          onOk={deletePlaylist}
          onCancel={closeModal}
          okText="Yes"
          >
          <p style={{textAlign: 'center', color: 'red'}}>Are you sure you want to delete {playlist.playlistName}?</p>
        </Modal>
      </div>
      {
        playlist.movies.length > 0 ?
          <div>
            <Slider {...slickSettings}>
              {playlist.movies.map((obj) => { return <Movie movie={obj} key={obj.id} playlist={playlist.playlistName} refreshCallback={refreshCallback}/> })}
            </Slider>
          </div> :
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <h1>
              No movies found
          </h1>
          </div>
      }
    </div>

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