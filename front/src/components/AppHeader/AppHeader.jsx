import React, { useContext, useState } from "react";
import { Badge, Button, Dropdown, Flex, Layout, Modal, Popover, message as antdMessage } from 'antd';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { BellOutlined, PhoneOutlined } from '@ant-design/icons';
import { CgProfile } from "react-icons/cg";
import { RiEarthFill, RiTelegramLine } from "react-icons/ri";
import { BsWhatsapp } from "react-icons/bs";
import { BarChart, Bar, CartesianGrid, YAxis } from 'recharts';

import styles from './appHeader.module.css';
import LoginModal from "../loginModal/LoginModal";
import { UserContext } from "../../App";
import AppModal from "../UI/appModal/AppModal";
import { editTeacherFields, editUserFields } from "../../utils/formFields";
import { checkIsUserExist, editUser } from "../../utils/api";
import Title from "antd/es/typography/Title";
import { formatWeekDataFromUser } from "../../utils/formatDataForCharts";
import { randomHexColor } from "../../utils/default";
import useScreenSize from './../../hooks/useScreenSize';
import { XAxis } from 'recharts';
import { useTranslation } from "react-i18next";

const { Header } = Layout;

const AppHeader = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isUserChangeModalOpen, setIsUserChangeModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const {userContext, setUserContext} = useContext(UserContext);

    const [messageApi, contextHolder] = antdMessage.useMessage();

    const screenSize = useScreenSize(700);

    const weekChartData = formatWeekDataFromUser(userContext ?? []).slice();

    const weekChartDataKeys= (weekChartData
        ?.reduce((acc, item) => [...acc, ...Object.keys(item)], [])
        ?.reduce((acc, item) => acc.includes(item) ? acc : [...acc, item],[]));

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
        localStorage.setItem('user', JSON.stringify(null));
        localStorage.setItem('all-users', JSON.stringify(null));
    }

    const handleChangeOpen = () => {
        setIsUserChangeModalOpen(true);
        setIsUserModalOpen(false);
    }


    const handleChange = async (values) => {
        const name = values?.fullName.split(' ');
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

    const items = [
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href={userContext?.conf}>
              Конференция
            </a>
          ),
        },
    ];

    const languageDropDown = (
        <Flex vertical gap='10px'>
            <Button onClick={() => changeLanguage('en')}>English</Button>
            <Button onClick={() => changeLanguage('ru')}>Russian</Button>
        </Flex>
    )

    return(
        <Header className={styles.header}>
            <Logo className={styles.logo}/>
            <div className={styles.contacts_holder}>
                <a target="_blank" href="https://wa.me/+79133968940"><BsWhatsapp className={styles.icons}/></a>
                <a target="_blank" href="https://t.me/Mr_Cat212"><RiTelegramLine className={styles.icons}/></a>
                <a href="tel:+79000000000">
                    <PhoneOutlined style={{fontSize: '50px', rotate: "90deg"}} className={styles.icons}/>
                    <span className={styles.phone_number}>+7-900-000-000</span>
                </a>
            </div>
            <div className={styles.authorization_buttons}>
                <Popover
                    content={languageDropDown}
                    title={t('language')}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                >
                    <Button><RiEarthFill /></Button>
                </Popover>
            {
                userContext
                ? (
                        <>
                            {
                                !userContext?.role && (
                                    <Dropdown
                                        menu={{
                                            items,
                                        }}
                                        disabled={!userContext?.conf}
                                    >
                                        <Badge count={userContext?.conf && 1}>
                                            <BellOutlined className={styles.icons} />
                                        </Badge>
                                    </Dropdown>
                                )
                            }
                            <CgProfile className={styles.icons} onClick={() => setIsUserModalOpen(true)}/>
                        </>
                ) : (
                        <>
                            <Button className={styles.button} onClick={() => {
                                setModalType('Регистрация');
                                setIsModalOpen(true);
                            }}>Регистрация</Button>
                            <Button className={styles.button} onClick={() => {
                                setModalType('Вход');
                                setIsModalOpen(true);
                            }}>Вход</Button>
                        </>
                )
            }
            </div>
            <LoginModal 
                open={isModalOpen} 
                setIsOpen={setIsModalOpen} 
                modalType={modalType} 
                setModalType={(type) => setModalType(type)}
            />
            {(!userContext?.role && userContext) ? (
                    <>
                        <Modal footer={false} onCancel={() => setIsUserModalOpen(false)} open={isUserModalOpen}>
                            <Title>{userContext?.fullName ?? userContext?.firstName + ' ' + userContext?.lastName}</Title>
                            <p key='number'><strong>Номер телефона:</strong> {userContext.phoneNumber}</p>
                            <p key='instrument'><strong>Инструмент:</strong> {userContext.tool}</p>
                            <p><strong>Количество занятий:</strong> {userContext?.status ?? 0}</p>
                            <BarChart
                                width={screenSize.width > 700 ? 500 : 400}
                                height={300}
                                data={weekChartData.slice(-7)}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 30,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis tickFormatter={(a) => customDayXAxis(a, weekChartData)}/>
                                <YAxis tickFormatter={(num) => num === 1 ? 'Активный' : ''}/>
                                {weekChartDataKeys.map((item, index) => {
                                    return(
                                        <Bar key={index} dataKey={item} stackId={index} fill={randomHexColor()} />
                                    )
                                })}
                            </BarChart>
                            <div className={styles.authorization_buttons}>
                                <Button onClick={handleChangeOpen}>Редактирование</Button>
                                <Button onClick={() => setIsPaymentModalOpen(true)}>Как оплатить? </Button>
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
                        <Modal open={isPaymentModalOpen} onCancel={() => setIsPaymentModalOpen(false)} footer={false} style={{textAlign: 'center'}}>
                            <Title>Как оплатить занятие?</Title>
                            <p>Оплата занятия возможна по системе быстрых платежей по реквизитам ниже. Обратите внимание: перед совершением перевода необходимо проверить корректность введенных данных получателя: номер телефона и ФИО. </p>
                            <Title>Реквизиты для перевода</Title>
                            <p>Номер телефона: <br />+7-900-000-00-00 <br />
                            ФИО: Иванов Иван Иванович</p>
                            <p>Название банка: ЦБРФСР</p>
                        </Modal>
                        
                    </>
                ) : userContext?.role && (
                        <>
                            <Modal footer={false} onCancel={() => setIsUserModalOpen(false)} open={isUserModalOpen}>
                                <Title>{userContext?.fullName ?? userContext?.firstName + ' ' + userContext?.lastName}</Title>
                                <p key='number'><strong>Номер телефона:</strong> {userContext.phoneNumber}</p>
                                <div className={styles.authorization_buttons}>
                                    <Button onClick={handleChangeOpen}>Редактирование</Button>
                                    <Button onClick={handleQuit}>Выход</Button>
                                </div>
                            </Modal>
                            <AppModal 
                                open={isUserChangeModalOpen} 
                                handleClose={() => setIsUserChangeModalOpen(false)} 
                                fields={editTeacherFields.map(item => ({...item, defaultValue: userContext[item.name]}))} 
                                footer={false}
                                fullWidth
                                handleSubmit={handleChange}
                            >
                                {contextHolder}
                            </AppModal>
                        </>
                )
            }
        </Header>
    )
}

const customDayXAxis = (rest, chartData) => {
    const length = chartData?.length - 6;
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return dayNames[new Date(`${new Date().getMonth()}/${rest + length}/${new Date().getFullYear()}`).getDay()]
}

export default AppHeader;