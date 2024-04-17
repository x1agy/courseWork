import React from "react";
import { Button, Layout } from 'antd';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as Telegram } from '../../assets/telegram.svg';
import { ReactComponent as Whatsapp } from '../../assets/whatsapp.svg';
import { PhoneOutlined } from '@ant-design/icons';

import styles from './appHeader.module.css'

const { Header } = Layout;

const appHeader = () => {
    return(
        <Header className={styles.header}>
            <Logo />
            <div className={styles.contacts_holder}>
                <a href=""><Whatsapp /></a>
                <a href=""><Telegram /></a>
                <a href="">
                    <PhoneOutlined style={{fontSize: '50px', rotate: "90deg"}} />
                    <span className={styles.phone_number}>+7-900-000-000</span>
                </a>
            </div>
            <div className={styles.autorisation_buttons}>
                <Button >Регистрация</Button>
                <Button >Вход</Button>
            </div>
        </Header>
    )
}

export default appHeader;