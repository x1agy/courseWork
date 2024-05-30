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
import { checkIsUserExist, editUser } from "../../utils/api";
import Title from "antd/es/typography/Title";
import { formatWeekDataFromUser } from "../../utils/formatDataForCharts";
import { randomHexColor } from "../../utils/default";
import useScreenSize from './../../hooks/useScreenSize';
import { XAxis } from 'recharts';
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const { Header } = Layout;

const emailRegexp =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

const phoneRegexp =
  /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/;

const AppHeader = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isUserChangeModalOpen, setIsUserChangeModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const { t, i18n } = useTranslation();

    const loginFields = [
        {
            label: t("mail"),
            validateTrigger: "onBlur",
            name: "login",
            rules: [
            { required: true, message: t('enterLogin') },
            { pattern: emailRegexp, message: "Введите корректную почту" },
            ],
        },
        {
            label: t("password"),
            validateTrigger: "onBlur",
            name: "password",
            rules: [{ required: true, message: "Введите пароль" }],
        },
    ];

    const editUserFields = [
        ...loginFields,
        {
        label: t('LFS'),
        validateTrigger: "onBlur",
        name: "fullName",
        rules: [
            { required: true, message: t("error1") },
            { pattern: /[А-яёЁ]+\s[А-яёЁ]+\s?([А-яёЁ]+)?/, message: t("error2") },
        ],
        },
        {
        label: t("phone"),
        validateTrigger: "onBlur",
        name: "phoneNumber",
        rules: [
            { required: true, message: t("error1") },
            { pattern: phoneRegexp, message: t("error3") },
        ],
        },
        {
        label: t("timeZone"),
        validateTrigger: "onBlur",
        name: "GMT",
        rules: [
            { required: true, message: t("error1") },
            { pattern: /[+-]\d?\d/g, message: "Введите правильный часовой пояс" },
        ],
        },
        {
        label: t("instrument"),
        validateTrigger: "onBlur",
        name: "tool",
        rules: [{ required: true, message: t("error1") }],
        },
    ];

    const editTeacherFields = [
        ...loginFields,
        {
        label: t("phone"),
        validateTrigger: "onBlur",
        name: "phoneNumber",
        rules: [
            { required: true, message: t("error1") },
            { pattern: phoneRegexp, message: t("error3") },
        ],
        },
    ];
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
        const name = values?.fullName?.split(' ') ?? ['','',''];
        const formattedUser = {...values, firstName: name[1], lastName: name[0], surname: name[2] ?? ''}
        const newProfile = {...userContext, ...formattedUser};

        if(JSON.stringify(newProfile) === JSON.stringify(userContext)){
            error(t('error6'));
            return
        }

        const isEmailExist = (await checkIsUserExist(values.login));

        if(isEmailExist !== 'not'){
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
              {t('conf')}
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
            <Flex className={styles.headerButtons}>
                <div className={styles.contacts_holder}>
                    <a target="_blank" href="https://wa.me/+79133968940"><BsWhatsapp className={styles.icons}/></a>
                    <a target="_blank" href="https://t.me/Mr_Cat212"><RiTelegramLine className={styles.icons}/></a>
                    <a href="tel:+79000000000">
                        <PhoneOutlined style={{fontSize: '50px', rotate: "90deg"}} className={styles.icons}/>
                        <span className={styles.phone_number}>+7-900-000-000</span>
                    </a>
                </div>
                <div className={styles.authorization_buttons}>
                {
                    userContext
                    ? (
                            <div className={styles.authIcons}>
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
                            </div>
                    ) : (
                            <div className={styles.notAuthIcons}>
                                <Button className={styles.button} onClick={() => {
                                    setModalType(t('signUp'));
                                    setIsModalOpen(true);
                                }}>{t('signUp')}</Button>
                                <Button className={styles.button} onClick={() => {
                                    setModalType(t('logIn'));
                                    setIsModalOpen(true);
                                }}>{t('logIn')}</Button>
                            </div>
                    )
                }
                </div>
            </Flex>
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
                            <p key='number'><strong>{t('phone')}:</strong> {userContext.phoneNumber}</p>
                            <p key='instrument'><strong>{t('instrument')}:</strong> {userContext.tool}</p>
                            <p><strong>{t('numberClasses')}:</strong> {userContext?.status ?? 0}</p>
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
                                <YAxis tickFormatter={(num) => num === 1 ? t('active') : ''}/>
                                {weekChartDataKeys.map((item, index) => {
                                    return(
                                        <Bar key={index} dataKey={item} stackId={index} fill={randomHexColor()} />
                                    )
                                })}
                            </BarChart>
                            <div className={styles.authorization_buttons}>
                                <Button onClick={handleChangeOpen}>{t('editing')}</Button>
                                <Button onClick={() => setIsPaymentModalOpen(true)}>{t('how')} </Button>
                                <Button onClick={handleQuit}>{t('exit')}</Button>
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
                            <Title>{t('how')} </Title>
                            <p>{t('info6')} </p>
                            <Title>{t('info7')}</Title>
                            <p>{t('phone')}: <br />+7-900-000-00-00 <br />
                            ФИО: Иванов Иван Иванович</p>
                            <p>{t('info8')}</p>
                        </Modal>
                        
                    </>
                ) : userContext?.role && (
                        <>
                            <Modal footer={false} onCancel={() => setIsUserModalOpen(false)} open={isUserModalOpen}>
                                <Title>{userContext?.fullName ?? userContext?.firstName + ' ' + userContext?.lastName}</Title>
                                <p key='number'><strong>{t('phone')}:</strong> {userContext.phoneNumber}</p>
                                <div className={styles.authorization_buttons}>
                                    <Button onClick={handleChangeOpen}>{t('editing')}</Button>
                                    <Button onClick={handleQuit}>{t('exit')}</Button>
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
    const dayNames = [t('mo'), t('tu'), t('we'), t('th'), t('fr'), t('sa'), t('su')];
    return dayNames[new Date(`${new Date().getMonth()}/${rest + length}/${new Date().getFullYear()}`).getDay()]
}

export default AppHeader;