import React from "react";
import { ReactComponent as Logo } from '../../assets/logo.svg';

import styles from './appFooter.module.css';
import { Flex, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { PhoneOutlined } from "@ant-design/icons";

const AppFooter = () => {
    return(
        <Footer className={styles.footer}>
            <Flex className={styles.footerContent}>
                <Logo className={styles.logo}/>
                <Title level={5}>
                    Школа игры на арфе Марии Маковецкой
                    <br />
                    <small className={styles.terms}>
                        Обращаясь к нам за услугами, вы даете согласие на обработку ваших персональных данных.
                    </small>
                    <small className={styles.terms}>
                        2024 - 2025 © Все права защищены
                    </small>
                </Title>
                <Typography.Text className={styles.callUs}>
                    <PhoneOutlined style={{rotate: '90deg'}}/>
                    +7-900-000-000
                    <br />
                    <b>почта@mail.ru</b>
                    <br />
                    Пн-Вс с 8:00 до 23:00
                </Typography.Text>
            </Flex>
        </Footer>
    )
}

export default AppFooter;