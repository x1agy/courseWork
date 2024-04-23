import React from "react";
import Modal from "antd/es/modal/Modal";
import Title from "antd/es/typography/Title";
import { Button, Form, Input, Select } from "antd";
import { gmtFields } from "../../../utils/formFields";

import styles from './appModal.module.css';

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
                                    {gmtFields.map((item, index) => (
                                        <Select.Option key={index} value={item.value}>{item.value + ' ' + item.name}</Select.Option>
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
                    <Button type="primary" htmlType="submit" style={{marginInlineEnd: '1em', width: fullWidth ? '100%' : ''}}>Отправить</Button>
                    {fields.length === 2 && <Button onClick={changePassword}>Забыли пароль?</Button>}
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AppModal;