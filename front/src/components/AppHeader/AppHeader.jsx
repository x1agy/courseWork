import React, { useContext, useState } from "react";
import { Button, Layout, Modal, message as antdMessage } from 'antd';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { BellOutlined, PhoneOutlined } from '@ant-design/icons';
import { CgProfile } from "react-icons/cg";
import { RiTelegramLine } from "react-icons/ri";
import { BsWhatsapp } from "react-icons/bs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import styles from './appHeader.module.css';
import LoginModal from "../loginModal/LoginModal";
import { UserContext } from "../../App";
import AppModal from "../UI/appModal/AppModal";
import { editUserFields } from "../../utils/formFields";
import { checkIsUserExist, editUser } from "../../utils/api";
import Title from "antd/es/typography/Title";
import { formatWeekDataFromUser } from "../../utils/formatDataForCharts";
import { randomHexColor } from "../../utils/default";

const { Header } = Layout;

const AppHeader = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const {userContext, setUserContext} = useContext(UserContext);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isUserChangeModalOpen, setIsUserChangeModalOpen] = useState(false);
    const [messageApi, contextHolder] = antdMessage.useMessage();
    const weekChartData = formatWeekDataFromUser(userContext ?? []);
    const weekChartDataKeys= weekChartData
        ?.reduce((acc, item) => [...acc, ...Object.keys(item)], [])
        ?.reduce((acc, item) => acc.includes(item) ? acc : [...acc, item],[]);

    const error = (message) => {
        messageApi.open({
        type: 'error',
        content: message,
        });
    }

    const success =(message) => {
        messageApi.open({
        type: 'success',
        content: message,
        });
    }   

    const handleQuit = () => {
        setUserContext(null);
        setIsUserModalOpen(false);
        localStorage.setItem('user', JSON.stringify(null))
    }

    const handleChangeOpen = () => {
        setIsUserChangeModalOpen(true);
        setIsUserModalOpen(false);
    }

    const handleChange = async (values) => {
        const name = values.fullName.split(' ');
        const formattedUser = {...values, firstName: name[1], lastName: name[0], surname: name[2] ?? ''}
        const newProfile = {...userContext, ...formattedUser};

        if(JSON.stringify(newProfile) === JSON.stringify(userContext)){
            error('Вы не внесли изменения');
            return
        }

        const isEmailExist = (await checkIsUserExist(values.login)).split(' ')[1];

        if(isEmailExist !== userContext.login){
            error('Пользователь с такой почтой уже существует');
        }else{
            const editResponse = await editUser(newProfile);

            if(editResponse === 'success'){
                setUserContext(newProfile);
                localStorage.setItem('user', JSON.stringify(newProfile));
                success('Изменения успешно внесены');
                setIsUserChangeModalOpen(false);
            }
        }
    }

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
            {
                userContext
                ? (
                    <div className={styles.authorization_buttons}>
                        <BellOutlined className={styles.icons}/>
                        <CgProfile className={styles.icons} onClick={() => setIsUserModalOpen(true)}/>
                    </div>
                ) : (
                    <div className={styles.authorization_buttons}>
                        <Button className={styles.button} onClick={() => {
                            setModalType('Регистрация');
                            setIsModalOpen(true);
                        }}>Регистрация</Button>
                        <Button className={styles.button} onClick={() => {
                            setModalType('Вход');
                            setIsModalOpen(true);
                        }}>Вход</Button>
                    </div>
                )
            }
            <LoginModal 
                open={isModalOpen} 
                setIsOpen={setIsModalOpen} 
                modalType={modalType} 
                setModalType={(type) => setModalType(type)}
            />
            {userContext && (
                <>
                    <Modal footer={false} onCancel={() => setIsUserModalOpen(false)} open={isUserModalOpen}>
                        <Title>{userContext.fullName}</Title>
                        <p><strong>Номер телефона:</strong> +{userContext.phoneNumber}</p>
                        <p><strong>Инструмент:</strong> {userContext.tool}</p>
                        <BarChart
                            width={500}
                            height={300}
                            data={weekChartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 30,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            {weekChartDataKeys.map((item, index) => {
                                return(
                                    <Bar dataKey={item} stackId={index} fill={randomHexColor()} />
                                )
                            })}
                        </BarChart>
                        <div className={styles.authorization_buttons}>
                            <Button onClick={handleChangeOpen}>Редактирование</Button>
                            <Button onClick={handleQuit}>Выход</Button>
                        </div>
                    </Modal>
                    <AppModal 
                        open={isUserChangeModalOpen} 
                        handleClose={() => setIsUserChangeModalOpen(false)} 
                        fields={editUserFields.map(item => ({...item, defaultValue: userContext[item.name]}))} 
                        footer={false}
                        fullWidth
                        handleSubmit={handleChange}
                    >
                        {contextHolder}
                    </AppModal>
                </>
            )}
        </Header>
    )
}

export default AppHeader;