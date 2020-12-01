import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import topBarStyle from "./TopBar.module.css"
import SearchBar from '../SearchBar/SearchBar';
import sideBarStyle from "./SideBar.module.css"
import { MenuOutlined } from '@ant-design/icons';
import FlexView from 'react-flexview/lib';
import Avatar from 'antd/lib/avatar/avatar';
import { Popover } from 'antd';


export default function TopBar(props) {

	const size = useWindowSize();
	const [version, setVersion] = useState("TOPBAR");

	const [showSideBar, setShowSideBar] = useState(true);

	useEffect(() => {
		if (size.width < 600)
			setVersion("SIDEBAR")
		else
			setVersion("TOPBAR")
		setShowSideBar(false)
	}, [size])

	function sideBar() {
		setShowSideBar(!showSideBar)
	}

	const content = (
		<div>
			<p>Content</p>
			<p>Content</p>
		</div>
	);

	return (
		<>
			{
				version === "TOPBAR" ?
					<FlexView className={topBarStyle.topBarWrapper}>
						<Link to="/">
							<li className={topBarStyle.topBarElement}>Easy Movies</li>
						</Link>
						<SearchBar onChange={props.onChange} />
						<Popover content={content} title={"account name"}>
							<Avatar style={{ margin: "0 20px", width: "40px", height: "40px" }} >A</Avatar>
						</Popover>
					</FlexView>
					:
					<ul className={`${sideBarStyle.topBar}`}>
						<li className={sideBarStyle.li}>
							<MenuOutlined onClick={sideBar} className={sideBarStyle.bars} />
							{/* <img src={bars} alt="menu" className={sideBarStyle.bars} onClick={sideBar} /> */}
							<div className={sideBarStyle.SearchBarContainer}><SearchBar onChange={props.onChange} /></div>

						</li>
					</ul>
			}
			{
				showSideBar &&
				<ul className={sideBarStyle.optionsContainer}>
					<Link to="/">
						<li className={topBarStyle.topBarElement}>Homepage</li>
					</Link>
				</ul>
			}
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