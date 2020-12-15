import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from "./TopBar.module.css"
import SearchBar from '../SearchBar/SearchBar';
import { HomeFilled, LoadingOutlined, } from '@ant-design/icons';
import FlexView from 'react-flexview/lib';
import Avatar from 'antd/lib/avatar/avatar';
import { Popover, message } from 'antd';
import classNames from 'classnames';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Input, Divider, Button, Upload } from 'antd';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import { AuthContext } from '../../App';


export default function TopBar(props) {
	const cookies = new Cookies();

	const size = useWindowSize();
	const [mobile, setMobile] = useState(false);
	const { username, setUsername } = useContext(AuthContext);
	const [usernameForm, setUsernameForm] = useState(undefined)
	const [usernameFormLogin, setUsernameFormLogin] = useState(undefined)
	const [passwordLogin, setPasswordLogin] = useState(undefined)
	const [password, setPassword] = useState(undefined)
	const [name, setName] = useState(undefined)
	const [nameLogged, setNameLogged] = useState(undefined)
	const [surnameLogged, setSurnameLogged] = useState(undefined)
	const [surname, setSurname] = useState(undefined)
	const [imgBase64, setImgBase64] = useState(undefined)



	useEffect(() => {
		setMobile(size.width < 600)
	}, [size])

	useEffect(() => {
		username && Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}`).then(res => {
			setNameLogged(res.data.name)
			setSurnameLogged(res.data.surname)
		})
	}, [username])

	const register = () => {
		Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/register`, {
			"username": usernameForm,
			"password": password,
			"name": name,
			"surname": surname,
			"image": imgBase64,
		}).then(res => {
			setUsernameFormLogin(usernameForm)
			setPasswordLogin(password)
			login(usernameForm, password);
		}).catch((res) => {
			switch (res.status) {
				//TODO: mettere i vari casi
				default:
					console.error(res)
					message.error("Si è verificato un errore durante la registrazione")
					break;
			}
		})
	}

	const login = (u, p) => {
		Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/login`, {
			"username": u ? u : usernameFormLogin,
			"password": p ? p : passwordLogin
		}).then(res => {
			cookies.set('JWTtoken', res.data.JWTtoken, { path: '/' });
			cookies.set('username', res.data.username, { path: '/' });
			setUsername(res.data.username);
			console.log(username);
		}).catch((res) => {
			switch (res.status) {
				//TODO: mettere i vari casi
				case "401":
					message.error("Credenziali errate")
					break;
				default:
					console.error(res)
					message.error("Si è verificato un errore durante il login")
					break;
			}
		})
	}

	const logout = () => {
		console.log("a");
		Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/${username}/logout`).then(res=>{
			cookies.remove("JWTtoken");
			cookies.remove("username");
			setUsername(undefined);
		})
	}

	const registerPopover = (
		<FlexView column style={{ alignItems: "center" }}>
			<FlexView style={{ alignItems: "center" }}>
				<AvatarUpload setImg={(r) => { setImgBase64(r) }} style={{ marginBottom: "10px", flexShrink: 0, fontSize: "30px", padding: "10px", width: "50px", height: "50px" }} />
			</FlexView>
			{/* <Avatar icon={<AiOutlineUserAdd />} style={{ marginBottom: "10px", flexShrink: 0, fontSize: "30px", padding: "10px", width: "50px", height: "50px" }} /> */}
			<Input placeholder="name" style={{ margin: "10 10px" }} onChange={e => setName(e.target.value)} />
			<div style={{ height: "10px" }} />
			<Input placeholder="surname" style={{ margin: "10 10px" }} onChange={e => setSurname(e.target.value)} />
			<div style={{ height: "10px" }} />
			<Input placeholder="username" style={{ margin: "10 10px" }} onChange={e => setUsernameForm(e.target.value)} />
			<div style={{ height: "10px" }} />
			<Input.Password placeholder="password" type="password" style={{ margin: "10 10px" }} onChange={e => setPassword(e.target.value)} />
			<Divider />
			<Button type="primary" style={{ width: "100%" }} onClick={register} disabled={!(usernameForm && password && name && surname && imgBase64)}>Registrati</Button>
		</FlexView>
	);

	const loginPopover = (
		<FlexView column style={{ alignItems: "center" }}>
			<Input value={usernameFormLogin} placeholder="username" style={{ margin: "10 10px" }} onChange={e => setUsernameFormLogin(e.target.value)} />
			<div style={{ height: "10px" }} />
			<Input.Password value={passwordLogin} placeholder="password" type="password" style={{ margin: "10 10px" }} onChange={e => setPasswordLogin(e.target.value)} />
			<Divider />
			<Button type="primary" style={{ width: "100%" }} onClick={() => login()} disabled={!(usernameFormLogin && passwordLogin)}>Accedi</Button>
		</FlexView>
	);

	const accountPopover = (
		<FlexView column style={{ alignItems: "center" }}>
			<Avatar src={`${process.env.REACT_APP_API_BASE_URL}/profile-images/${username}.jpg`} icon={<AiOutlineUserAdd />} style={{ marginBottom: "10px", flexShrink: 0, fontSize: "30px", padding: "10px", width: "50px", height: "50px" }} />
			<div>{nameLogged + " " + surnameLogged}</div>
			<Button type="link" style={{ width: "100%" }} ><Link to={"/playlists"}>Playlists</Link></Button>
			<Button type="primary" style={{ width: "100%" }} onClick={logout}>Disconnetti</Button>
		</FlexView>
	);

	return (
		<>
			<FlexView className={classNames(styles.topBarWrapper, { [styles.topBarWrapperMobile]: mobile })}>
				<Link to="/" className={styles.topBarElement}>
					{mobile ? <HomeFilled style={{ color: "white", fontSize: "24px" }} /> : <div className={styles.topBarElement}>Easy Movies</div>}
				</Link>
				<SearchBar onChange={props.onChange} mobile={mobile} />
				{!username ?
					<FlexView shrink={0}>
						<Popover getPopupContainer={trigger => trigger.parentElement} content={registerPopover} title={"Crea un nuovo Account"}>
							<div className={styles.topBarElement}>Registrati</div>
						</Popover>
						<Popover getPopupContainer={trigger => trigger.parentElement} content={loginPopover} title={"Accedi"}>
							<div className={styles.topBarElement}>Accedi</div>
						</Popover>
					</FlexView>
					:
					<Popover getPopupContainer={trigger => trigger.parentElement} content={accountPopover} title={username}>
						<Avatar className={classNames(styles.topBarElement, styles.accountIcon, { [styles.accountIconMobile]: mobile })} src={`${process.env.REACT_APP_API_BASE_URL}/profile-images/${username}.jpg`}></Avatar>
					</Popover>
				}
			</FlexView>
		</>

	)
}

function useWindowSize() {
	const isClient = typeof window === 'object';

	function getSize() {
		return {
			width: isClient ? window.innerWidth : undefined,
			height: isClient ? window.innerHeight : undefined
		};
	}

	const [windowSize, setWindowSize] = useState(getSize);

	// @ts-ignore
	useEffect(() => {
		if (!isClient) {
			return false;
		}

		function handleResize() {
			setWindowSize(getSize());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}); // Empty array ensures that effect is only run on mount and unmount
	return windowSize;
}

class AvatarUpload extends React.Component {
	state = {
		loading: false,
	};

	handleBase64 = imageUrl => {
		this.setState({
			imageUrl,
			loading: false,
		});
		this.props.setImg(imageUrl);
	}

	handleChange = info => {
		if (info.file.status === 'uploading') {
			this.setState({ loading: true });
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, this.handleBase64);
		}
	};

	render() {
		const { loading, imageUrl } = this.state;
		const uploadButton = (
			<div>
				{loading ? <LoadingOutlined /> : <AiOutlineUserAdd style={{ fontSize: "24px" }} />}
				<div style={{ marginTop: 8 }}>Upload</div>
			</div>
		);
		return (
			<Upload
				name="avatar"
				listType="picture-card"
				className="avatar-uploader"
				showUploadList={false}
				action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
				beforeUpload={beforeUpload}
				onChange={this.handleChange}
			>
				{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
			</Upload>
		);
	}
}

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

function beforeUpload(file) {
	const isJpg = file.type === 'image/jpeg';
	if (!isJpg) {
		message.error('Puoi caricare solo file JPG');
	}
	const isLt2M = file.size / 1024 / 1024 < 4;
	if (!isLt2M) {
		message.error('Puoi caricare solo file con dimensione inferiore a 4 MB');
	}
	return isJpg && isLt2M;
}
