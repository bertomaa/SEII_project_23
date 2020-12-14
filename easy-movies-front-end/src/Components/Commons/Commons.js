import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd';
import React from 'react'
import style from "./Commons.module.css"

export const Spinner = (props) => {
    const antIcon = <LoadingOutlined style={{ fontSize: props.size ? props.size : 24 }} spin />;
    return (
            <Spin indicator={antIcon}  className={style.spinner}/>
    )
}