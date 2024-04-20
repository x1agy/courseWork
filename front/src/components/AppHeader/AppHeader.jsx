import React from "react";
import { Button, Layout } from 'antd';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { PhoneOutlined } from '@ant-design/icons';
import { RiTelegramLine } from "react-icons/ri";
import { BsWhatsapp } from "react-icons/bs";

import styles from './appHeader.module.css'

const { Header } = Layout;

const appHeader = () => {
    return(
        <Header className={styles.header}>
            <Logo className={styles.logo}/>
            <div className={styles.contacts_holder}>
                <a href="фыв"><BsWhatsapp className={styles.icons}/></a>
                <a href="фыв"><RiTelegramLine className={styles.icons}/></a>
                <a href="tel:+79000000000">
                    <PhoneOutlined style={{fontSize: '50px', rotate: "90deg"}} className={styles.icons}/>
                    <span className={styles.phone_number}>+7-900-000-000</span>
                </a>
            </div>
            <div className={styles.authorization_buttons}>
                <Button>Регистрация</Button>
                <Button>Вход</Button>
            </div>
        </Header>
    )
}

export default appHeader;