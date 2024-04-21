import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Anchor, Button, Form, Input, Modal, message } from "antd";
import AppModal from "../UI/appModal/AppModal";
import Title from "antd/es/typography/Title";

import { changePassword, checkIsUserExist, confirmEmail, createAccount } from './../../utils/api';
import { loginFields, recoveryFields, registrationFields } from "../../utils/formFields";

const anchorTypes = ['Регистрация', 'Вход'];

const reducer = (state, action) => {
    switch(action.type){
        case('loginResult'): {
            return({
                ...state,
                success: action.payload?.success,
                error: action.payload?.error,
                emailCode: undefined,
                isConfirmed: false,
                isConfirmEmailModalOpen: false,
            })
        }
        case('emailConfirm'): {
            return({
                ...state,
                emailCode: action.payload?.emailCode,
                isConfirmed: action.payload?.isConfirmed ?? false,
                isConfirmEmailModalOpen: action.payload?.isConfirmEmailModalOpen
            })
        }
        default: {

        }
    }
}

const initialState = {
    success: undefined,
    error: undefined,
    emailCode: undefined,
    isConfirmed: false,
    isConfirmEmailModalOpen: false,
}

const LoginModal = ({
    open, 
    setIsOpen, 
    modalType, 
    setModalType
}) => {

    const [messageApi, contextHolder] = message.useMessage();
    const [{
        emailCode, 
        isConfirmEmailModalOpen, 
        isConfirmed, 
        error: errorMessage, 
        success: successMessage
    }, dispatch] = useReducer(reducer, initialState);

    const [user, setUser] = useState();
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const error = useCallback((message) => {
        messageApi.open({
        type: 'error',
        content: message ?? 'Произошла ошибка',
        });
    }, [messageApi]);

    const success = useCallback((message) => {
        messageApi.open({
        type: 'success',
        content: message ?? 'Аккаунт успешно создан',
        });
    }, [messageApi])

    const handleAnchorClick = (e, link) => {
        setModalType(anchorTypes[link.href]);
        e.preventDefault();
    }

    const handleSubmit = async (user) => {
        setUser(user)
        if(modalType === 'Вход'){
            try{
                const profile = await checkIsUserExist({login: user.login, password: user.password});
                if(profile?.result ?? true){
                    dispatch({
                        type: 'loginResult',
                        payload: {success: 'Вы успешно вошли'}
                    })
                }else{
                    dispatch({
                        type: 'loginResult',
                        payload: {error: 'Неправильный логин или пароль'}
                    })
                }
                console.log(profile);
            }catch(e){
                console.log(e)
                dispatch({
                    type: 'loginResult',
                    payload: {error: 'Произошла ошибка при входе'}
                })
            }
        }else{
            const isExist = (await checkIsUserExist(user.login)) !== 'not';
            if(isExist){
                error('Пользователь с такой почтой уже существует')
            }else{
                const code = await confirmEmail(user.login);
                dispatch({
                    type: 'emailConfirm',
                    payload: {
                        emailCode: code,
                        isConfirmEmailModalOpen: true
                    }
                });
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
                    dispatch({
                        type: 'loginResult',
                        payload: {
                            success: 'Аккаунт успешно создан'
                        }
                    })
                }catch(e){
                    console.log(e)
                    dispatch({
                        type: 'loginResult',
                        payload: {
                            success: 'Произошла ошибка при создании аккаунта'
                        }
                    })
                }
            }
        }
        func();
    }, [isConfirmed, user])

    useEffect(() => {
        if(successMessage){
            success(successMessage);
            setIsOpen(false);
        }else if(errorMessage){
            error(errorMessage);
        }
        dispatch({
            type: 'loginResult',
            payload: {}
        })
    }, [errorMessage, successMessage, success, error, setIsOpen])

    return(
        <AppModal 
            open={open} 
            handleClose={() => setIsOpen(false)}
            title={modalType}
            fields={modalType === 'Вход' ? loginFields : registrationFields}
            handleSubmit={handleSubmit}
            footer={false}
            changePassword={() => setIsChangePasswordOpen(true)}
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
                handleClose={() => dispatch({type: 'emailConfirm', payload: {isConfirmEmailModalOpen: false}})} 
                pattern={emailCode}
                setIsConfirmed={() => dispatch({type: 'emailConfirm', payload: {isConfirmed: true}})}
            />
            <ChangePasswordModal 
                open={isChangePasswordOpen}
                handleClose={() => setIsChangePasswordOpen(false)}
                setError={(e) => dispatch({
                    type: 'loginResult',
                    payload: {
                        error: e
                    }
                })}
                setSuccess={(e) => dispatch({
                    type: 'loginResult',
                    payload: {
                        success: e
                    }
                })}
            />
        </AppModal>
    )
}

const ConfirmEmailModal = ({open, handleClose, pattern, setIsConfirmed}) => {
    
    const handleSubmit = () => {
        handleClose();
        setIsConfirmed(true);
    }

    const codeRegexp = new RegExp(pattern);

    return(
        <Modal open={open} onCancel={handleClose} footer={false}>
            <Title level={5}>
                Введите код который пришёл вам на почту
            </Title>
            <Form onFinish={handleSubmit }>
                <Form.Item
                    name='pipipi'
                    rules={[
                        {
                            required: true, 
                            message: 'Введите код', 
                            validateTrigger: "onBlur"
                        }, 
                        {
                            pattern: codeRegexp, 
                            message: 'Неверный код',
                            validateTrigger: "onBlur"
                        }
                    ]}>
                    <Input.OTP />
                </Form.Item>
                <Button htmlType="submit">Отправить</Button>
            </Form>
        </Modal>
    )
}

const ChangePasswordModal = ({open, handleClose, setError, setSuccess}) => {

    const [isEnterCodeOpened, setIsEnterCodeOpened] = useState(false);
    const [userValues, setUserValues] = useState();
    const [code, setCode] = useState();

    const getCode = async (login) => {
        const codeEmail = await confirmEmail(login);
        setCode(codeEmail)
    }

    const handleSubmit = (values) => {
        setUserValues(values);
        setIsEnterCodeOpened(true);
        getCode(values.login);
    }

    return(
        <>
            {!isEnterCodeOpened
                ?   <AppModal
                        fields={[...recoveryFields]}
                        title='Восстановление пароля'
                        open={open}
                        handleClose={handleClose}
                        handleSubmit={handleSubmit}
                        footer={false}
                    >
                    </AppModal>
                :   <AppModal
                        open={isEnterCodeOpened}
                        title='Введите код'
                        handleClose={() => setIsEnterCodeOpened(false)}
                        fields={[{
                            label: 'Введите код',
                            validateTrigger: "onBlur",
                            name: 'code',
                            rules: [
                                {required: true, message: 'Введите код'},
                                {pattern: new RegExp(code), message: 'Неправильный код'}
                            ]
                        }]}
                        handleSubmit={() => {
                            try{
                                changePassword(userValues)
                                setSuccess('Пароль успешно изменен')
                            }catch(e){
                                console.log(e);
                                setError('Произошла ошибка при смене пароля')
                            }
                            setIsEnterCodeOpened(false);
                            handleClose();
                        }}
                        footer={false}
                    >

                    </AppModal>
            }
        </>
    )
}

export default LoginModal;