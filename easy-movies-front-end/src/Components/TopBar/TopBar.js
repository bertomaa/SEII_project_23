import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "./TopBar.module.css"
import SearchBar from '../SearchBar/SearchBar';
import { HomeFilled, HomeOutlined, MenuOutlined } from '@ant-design/icons';
import FlexView from 'react-flexview/lib';
import Avatar from 'antd/lib/avatar/avatar';
import { Popover } from 'antd';
import classNames from 'classnames';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Input, Divider, Button } from 'antd';


export default function TopBar(props) {

	const size = useWindowSize();
	const [mobile, setMobile] = useState(false);

	useEffect(() => {
		setMobile(size.width < 600)
	}, [size])

	const registerPopover = (
		<FlexView column style={{alignItems: "center"}}>
			<Avatar icon={<AiOutlineUserAdd />} style={{marginBottom: "10px", flexShrink: 0, fontSize: "30px", padding: "10px", width: "50px", height: "50px" }} />
			<Input placeholder="username" style={{margin: "10 10px"}}/>
			<div style={{height: "10px"}}/>
			<Input placeholder="password" style={{margin: "10 10px"}}/>
			<Divider />
			<Button type="primary" style={{width: "100%"}}>Registrati</Button>
		</FlexView>
	);

	const loginPopover = (
		<FlexView column style={{alignItems: "center"}}>
			<Input placeholder="username" style={{margin: "10 10px"}}/>
			<div style={{height: "10px"}}/>
			<Input placeholder="password" style={{margin: "10 10px"}}/>
			<Divider />
			<Button type="primary" style={{width: "100%"}}>Accedi</Button>
		</FlexView>
	);

	const accountPopover = (
		<FlexView column style={{alignItems: "center"}}>
			<Avatar icon={<AiOutlineUserAdd />} style={{marginBottom: "10px", flexShrink: 0, fontSize: "30px", padding: "10px", width: "50px", height: "50px" }} />
			<div>Utente</div>
			<Button type="primary" style={{width: "100%"}}>Disconnetti</Button>
		</FlexView>
	);

	return (
		<>
			<FlexView className={classNames(styles.topBarWrapper, { [styles.topBarWrapperMobile]: mobile })}>
				<Link to="/" className={styles.topBarElement}>
					{mobile ? <HomeFilled style={{ color: "white", fontSize: "24px" }} /> : <div className={styles.topBarElement}>Easy Movies</div>}
				</Link>
				<SearchBar onChange={props.onChange} mobile={mobile} />
				<Popover content={registerPopover} title={"Crea un nuovo Account"}>
					<div className={styles.topBarElement}>Registrati</div>	
				</Popover>
				<Popover content={loginPopover} title={"Accedi"}>
					<div className={styles.topBarElement}>Accedi</div>	
				</Popover>
				<Popover content={accountPopover} title={"nome account"}>
					<Avatar className={classNames(styles.topBarElement, styles.accountIcon, { [styles.accountIconMobile]: mobile })} >A</Avatar>
				</Popover>
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