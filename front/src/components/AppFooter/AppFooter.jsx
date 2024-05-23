import React from "react";
import { ReactComponent as Logo } from '../../assets/logo.svg';

import styles from './appFooter.module.css';
import { Flex, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const AppFooter = () => {
    const {t} = useTranslation()

    return(
        <Footer className={styles.footer}>
            <Flex className={styles.footerContent}>
                <Logo className={styles.logo}/>
                <Title level={5}>
                    {t('footerInfo1')}
                    <br />
                    <small className={styles.terms}>
                        {t('footerInfo2')}
                    </small>
                    <small className={styles.terms}>
                        {t('footerInfo3')}
                    </small>
                </Title>
                <Typography.Text className={styles.callUs}>
                    <PhoneOutlined style={{rotate: '90deg'}}/>
                    +7-900-000-000
                    <br />
                    <b>почта@mail.ru</b>
                    <br />
                    {t('footerInfo5')}
                </Typography.Text>
            </Flex>
        </Footer>
    )
}

export default AppFooter;