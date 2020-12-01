import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "./TopBar.module.css"
import SearchBar from '../SearchBar/SearchBar';
import { HomeFilled, HomeOutlined, MenuOutlined } from '@ant-design/icons';
import FlexView from 'react-flexview/lib';
import Avatar from 'antd/lib/avatar/avatar';
import { Popover } from 'antd';
import classNames from 'classnames';


export default function TopBar(props) {

	const size = useWindowSize();
	const [mobile, setMobile] = useState(false);

	useEffect(() => {
		setMobile(size.width < 600)
	}, [size])

	const content = (
		<div>
			<p>Content</p>
			<p>Content</p>
		</div>
	);

	return (
		<>
			<FlexView className={classNames(styles.topBarWrapper, {[styles.topBarWrapperMobile]: mobile})}>
				<Link to="/" className={styles.topBarElement}>
					{mobile ? <HomeFilled style={{color: "white", fontSize: "24px"}}/> : <div className={styles.topBarElement}>Easy Movies</div>}
				</Link>
				<SearchBar onChange={props.onChange} mobile={mobile}/>
				<Popover content={content} title={"account name"}>
					<Avatar className={classNames(styles.topBarElement, styles.accountIcon, {[styles.accountIconMobile]: mobile})} >A</Avatar>
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