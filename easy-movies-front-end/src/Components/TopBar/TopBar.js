import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from "./TopBar.module.css"
import SearchBar from '../SearchBar/SearchBar';
import { HomeFilled, HomeOutlined, MenuOutlined } from '@ant-design/icons';
import FlexView from 'react-flexview/lib';
import Avatar from 'antd/lib/avatar/avatar';
import { Popover, message } from 'antd';
import classNames from 'classnames';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Input, Divider, Button } from 'antd';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import { AuthContext } from '../../App';


export default function TopBar(props) {
	const cookies = new Cookies();

	const size = useWindowSize();
	const [mobile, setMobile] = useState(false);
	const { username, setUsername } = useContext(AuthContext);
	let usernameForm, password, name, surname;

	useEffect(() => {
		setMobile(size.width < 600)
	}, [size])

	const register = () => {
		Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/register`, {
			"username": usernameForm,
			"password": password,
			"name": name,
			"surname": surname,
		}).then(res => {
			cookies.set('JWTtoken', res.data.JWTtoken, { path: '/' });
			setUsername("aaaa");
			console.log(username);
		}).catch((res)=>{
			switch(res.status){
				//TODO: mettere i vari casi
				default: 
					console.error(res)
					message.error("Si è verificato un errore durante la registrazione")
					break;
			}
		})
	}

	const login = () => {
		Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/login`, {
			"username": usernameForm,
			"password": password
		}).then(res => {
			cookies.set('JWTtoken', res.data.JWTtoken, { path: '/' });
			setUsername("aaaa");
			console.log(username);
		}).catch((res)=>{
			switch(res.status){
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
		cookies.remove("JWTtoken");
		setUsername(undefined);
	}

	const registerPopover = (
		<FlexView column style={{ alignItems: "center" }}>
			<Avatar icon={<AiOutlineUserAdd />} style={{ marginBottom: "10px", flexShrink: 0, fontSize: "30px", padding: "10px", width: "50px", height: "50px" }} />
			<Input placeholder="name" style={{ margin: "10 10px" }} onChange={e => name = e.target.value} />
			<div style={{ height: "10px" }} />
			<Input placeholder="surname" style={{ margin: "10 10px" }} onChange={e => surname = e.target.value} />
			<div style={{ height: "10px" }} />
			<Input placeholder="username" style={{ margin: "10 10px" }} onChange={e => usernameForm = e.target.value} />
			<div style={{ height: "10px" }} />
			<Input.Password placeholder="password" type="password" style={{ margin: "10 10px" }} onChange={e => password = e.target.value} />
			<Divider />
			<Button type="primary" style={{ width: "100%" }} onClick={register}>Registrati</Button>
		</FlexView>
	);

	const loginPopover = (
		<FlexView column style={{ alignItems: "center" }}>
			<Input placeholder="username" style={{ margin: "10 10px" }} onChange={e => usernameForm = e.target.value}/>
			<div style={{ height: "10px" }} />
			<Input.Password placeholder="password" type="password" style={{ margin: "10 10px" }} onChange={e => password = e.target.value}/>
			<Divider />
			<Button type="primary" style={{ width: "100%" }} onClick={login}>Accedi</Button>
		</FlexView>
	);

	const accountPopover = (
		<FlexView column style={{ alignItems: "center" }}>
			<Avatar icon={<AiOutlineUserAdd />} style={{ marginBottom: "10px", flexShrink: 0, fontSize: "30px", padding: "10px", width: "50px", height: "50px" }} />
			<div>Utente</div>
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
						<Popover content={registerPopover} title={"Crea un nuovo Account"}>
							<div className={styles.topBarElement}>Registrati</div>
						</Popover>
						<Popover content={loginPopover} title={"Accedi"}>
							<div className={styles.topBarElement}>Accedi</div>
						</Popover>
					</FlexView>
					:
					<Popover content={accountPopover} title={"nome account"}>
						<Avatar className={classNames(styles.topBarElement, styles.accountIcon, { [styles.accountIconMobile]: mobile })} >A</Avatar>
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