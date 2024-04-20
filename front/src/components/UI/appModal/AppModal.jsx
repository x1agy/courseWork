import React from "react";
import Modal from "antd/es/modal/Modal";
import Title from "antd/es/typography/Title";

import styles from './appModal.module.css';
import { Button, Form, Input } from "antd";

const modalStyles = {
    mask: {
        backdropFilter: 'blur(10px)',
    },
};

const AppModal = ({open, handleClose, title, children, fields, handleSubmit, ...rest}) => {


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
            <Form onFinish={handleSubmit} layout="vertical" autoComplete='true'>
                {fields.map((item, index) => {
                    return(
                        item.name === 'password'
                        ?   <Form.Item label={item.label} validateTrigger="onBlur" name={item.name} rules={[...item.rules]} key={index}>
                                <Input.Password />
                            </Form.Item>
                        :   <Form.Item label={item.label} validateTrigger="onBlur" name={item.name} rules={[...item.rules]} key={index}>
                                <Input />
                            </Form.Item>   
                    )
                })}
                <Form.Item>
                    <Button type="primary" htmlType="submit">Отправить</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AppModal;