import { Flex, Tabs } from "antd";
import { useContext, useEffect } from "react";
import { AllUserContext, UserContext } from "../../App";

import styles from './TeacherPage.module.css';
import { useNavigate } from "react-router-dom";
import { UsersRepertoire } from "./usersRepertoire/UsersRepertoire";
import { UsersList } from "../../components/UsersList/UsersList";

export const TeacherPage = () => {

    const {allUsers, setRefetchValue} = useContext(AllUserContext);
    const {userContext} = useContext(UserContext); 
    const navigate = useNavigate();

    useEffect(() => {
        if(!userContext?.role){
            navigate('/')
        }
    }, [allUsers, userContext])

    const tabsItems = [
        {
            key: 'part-1',
            label: 'Мои ученики',
            children: <UsersList allUsers={allUsers} setRefetchValue={setRefetchValue}/>
        },
        {
            key: 'part-2',        
            label: 'Репертуар',
            children: <UsersRepertoire allUsers={allUsers}/>
        },
    ]
    
    return(
        <Flex vertical className={styles.container}>
            <Tabs
                direction="horizontal"
                className={styles.anchor}
                items={tabsItems}
            />
        </Flex>
    );
};