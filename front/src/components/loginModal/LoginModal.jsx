import React, { useEffect, useState } from "react";
import AppModal from "../UI/appModal/AppModal";
import { Anchor, Button, Form, Input, Modal, message } from "antd";
import { checkIsUserExist, confirmEmail, createAccount } from './../../utils/api';
import Title from "antd/es/typography/Title";

const emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

const phoneRegexp = /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/

const loginFields = [
    {
        label: 'Почта',
        validateTrigger: "onBlur",
        name: 'login',
        rules: [
            {required: true, message: 'Введите логин'},
            {pattern: emailRegexp, message: 'Введите корректную почту'}
        ]
    },
    {
        label: 'Пароль',
        validateTrigger: 'onBlur',
        name: 'password',
        rules: [
            {required: true, message: 'Введите пароль'}
        ]
    }
];

const registrationFields = [
    ...loginFields,
    {
        label: 'ФИО (формат: фамилия имя отчество если есть)',
        validateTrigger: 'onBlur',
        name: 'fullName',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /[А-яёЁ]+\s[А-яёЁ]+\s?([А-яёЁ]+)?/, message: 'Введите ФИО'}
        ]
    },
    {
        label: 'Номер телефона',
        validateTrigger: 'onBlur',
        name: 'phoneNumber',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: phoneRegexp, message: 'Введите правильный номер телефона'}
        ]
    },
    {
        label: 'Часовой пояс (числовой формат с "+" или "-" в начале)',
        validateTrigger: 'onBlur',
        name: 'GMT',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /[+-]\d?\d/g, message: 'Введите правильный часовой пояс'}
        ]
    },
    {
        label: 'Инструмент',
        validateTrigger: 'onBlur',
        name: 'tool',
        rules: [
            {required: true, message: 'Заполните поле'}
        ]
    },
    {
        label: 'Сколько лет обучаетесь?',
        validateTrigger: 'onBlur',
        name: 'spendTime',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /\d?\d/g, message: 'Введите числовое значение'}
        ]
    },
]

const anchorTypes = ['Регистрация', 'Вход'];

const LoginModal = ({open, setIsOpen, modalType, setModalType}) => {

    const [messageApi, contextHolder] = message.useMessage();
    const [createResult, setCreateResult] = useState('');
    const [isConfirmEmailModalOpen, setIsConfirmEmailModalOpen] = useState(false);
    const [emailCode, setEmailCode] = useState();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [user, setUser] = useState()

    const success = () => {
        messageApi.open({
        type: 'success',
        content: 'Аккаунт успешно создан',
        });
    };

    const error = (message) => {
        messageApi.open({
        type: 'error',
        content: message ?? 'Произошла ошибка',
        });
    };

    const handleAnchorClick = (e, link) => {
        setModalType(anchorTypes[link.href]);
        e.preventDefault();
    }

    const handleSubmit = async (user) => {
        setUser(user)
        if(modalType === 'Вход'){
            const profile = await checkIsUserExist(user.login);
            console.log(profile);
        }else{
            const isExist = (await checkIsUserExist(user.login)) !== 'not';
            if(isExist){
                error('Пользователь с такой почтой уже существует')
            }else{
                const code = await confirmEmail(user.login);
                setEmailCode(code);
                setIsConfirmEmailModalOpen(true);
            }
        }
    }

    useEffect(() => {
        const func = async () => {
            if(isConfirmed){
                const name = user.fullName.split(' ');
                const formattedUser = {...user, firstName: name[1], lastName: name[0], surname: name[2] ?? ''};
                try{
                    await createAccount(formattedUser);
                    setCreateResult('success')
                }catch(e){
                    console.log(e)
                    setCreateResult('error')
                }
            }
        }
        func();
    }, [isConfirmed])

    useEffect(() => {
        if(createResult === 'success'){
            success();
            setIsOpen(false);
        }else if(createResult === 'error'){
            error();
        }
        setCreateResult('')
    }, [createResult])

    return(
        <AppModal 
            open={open} 
            handleClose={() => setIsOpen(false)}
            title={modalType}
            fields={modalType === 'Вход' ? loginFields : registrationFields}
            handleSubmit={handleSubmit}
            footer={false}
        >
            {contextHolder}
            <Anchor 
                direction="horizontal"
                onClick={handleAnchorClick}
                
                items={[
                    {
                        key: '0',
                        href: '0',
                        title: anchorTypes[0]
                    },
                    {
                        key: '1',
                        href: '1',
                        title: anchorTypes[1]
                    }
                ]}
            />
            <ConfirmEmailModal 
                open={isConfirmEmailModalOpen} 
                handleClose={() => setIsConfirmEmailModalOpen(false)} 
                pattern={emailCode}
                setIsConfirmed={setIsConfirmed}
            />
        </AppModal>
    )
}

const ConfirmEmailModal = ({open, handleClose, pattern, setIsConfirmed}) => {
    
    const handleSubmit = () => {
        setIsConfirmed(true);
        handleClose();
    }

    return(
        <Modal open={open} onCancel={handleClose} footer={false}>
            <Form onFinish={handleSubmit }>
                <Title level={5}>
                    Введите код который пришёл вам на почту
                </Title>
                <Form.Item rules={[{required: true, message: 'Введите код'}, {pattern: pattern, message: 'Неверный код'}]}>
                    <Input.OTP />
                </Form.Item>
                <Button htmlType="submit">Отправить</Button>
            </Form>
        </Modal>
    )
}

export default LoginModal;