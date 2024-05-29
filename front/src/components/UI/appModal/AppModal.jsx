import React, { useState } from "react";
import Modal from "antd/es/modal/Modal";
import Title from "antd/es/typography/Title";
import { Button, Form, Input, Select } from "antd";
import { gmtFields } from "../../../utils/formFields";

import styles from './appModal.module.css';
import { useTranslation } from "react-i18next";

const modalStyles = {
    mask: {
        backdropFilter: 'blur(10px)',
    },
};

const AppModal = ({
        open, 
        handleClose, 
        title, 
        children, 
        fields, 
        handleSubmit, 
        changePassword,
        fullWidth,
        ...rest
    }) => {

    const [form] = Form.useForm();

    const onGmtChange = (value) => {
        form.setFieldsValue({GMT: value})
    }

    const {t} = useTranslation()

    return(
        <Modal 
            open={open} 
            onCancel={handleClose}
            className={styles.modal}
            styles={modalStyles}
            {...rest} 
        >
            {children}
            <Title className={styles.title}>{title}</Title>
            <Form onFinish={handleSubmit} layout="vertical" autoComplete='true' form={form}>
                {fields.map((item, index) => {
                    return(
                        <Form.Item 
                            label={item.label} 
                            validateTrigger="onBlur" 
                            name={item.name} 
                            rules={[...item.rules]} 
                            key={index}
                            initialValue={item.defaultValue}
                        >
                            {
                                item.name === 'GMT'
                                ? 
                                  <Select onChange={onGmtChange}>
                                    {Array.from({ length: 22 }, (_, k) => k).map((_, index) => (
                                        <Select.Option key={index} value={t('GMT'+ (index + 1))}>{t('GMT'+ (index + 1))}</Select.Option>
                                    ))}
                                  </Select>
                                : item.name === 'password'
                                ? <Input.Password />
                                : <Input />
                            }
                        </Form.Item>   
                    )
                })}
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{marginInlineEnd: '1em', width: fullWidth ? '100%' : ''}}>{t('send')}</Button>
                    {(fields.length === 2 && title !== t('recoveryPass')) && <Button onClick={changePassword}>{t('forgot')}</Button>}
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AppModal;