import React, { useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { Flex, Tabs } from "antd";

import styles from './userPage.module.css';
import { UserStats } from './../../components/UserStats/UserStats';
import Calendar from "../../components/Calendar/Calendar";
import { useNavigate } from "react-router-dom";

const tabsItems = [
    {
        key: 'part-1',
        label: 'Трекер',
        children: <Calendar />
    },
    {
        key: 'part-2',        
        label: 'Статистика',
        children: <UserStats />
    },
    {
        key: 'part-3',
        label: 'Репертуар',
        children: '321'
    },
]

export const UserPage = () => {

    const {userContext} = useContext(UserContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!userContext){
            navigate('/')
        }
    }, [userContext])

    return(
        <Flex className={styles.container}>
            <Tabs
                direction="horizontal"
                className={styles.anchor}
                items={tabsItems}
            >
            </Tabs>
        </Flex>
    )
}