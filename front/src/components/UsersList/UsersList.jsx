import { Button, Flex, InputNumber, Table } from "antd";
import { getTimeInTimezone } from "../../utils/default";
import { createConf, editUser } from "../../utils/api";
import { useState } from "react";

import styles from './UsersList.module.css'

const columns = [
    {
        title: 'ФИО',
        dataIndex: 'name',
    },
    {
        title: 'Номер телефона',
        dataIndex: 'phone',
    },
    {
        title: 'Инструмент',
        dataIndex: 'tool',
    },
    {
        title: 'Время',
        dataIndex: 'time',
    },
    {
        title: 'Кол-во занятий',
        dataIndex: 'status'
    },
    {
        title: 'Создание конференции',
        dataIndex: 'button'
    }
];

export const UsersList = ({allUsers, setRefetchValue}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    
    const handleCreateConf = (user) => {
        setIsLoading(true);
        createConf().then(res => {
            return editUser({...user, conf: res, status: user.status - 1}).then(_ => {
                setRefetchValue(prev => prev + 1);
            })
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const handleDeleteConf = (user) => {
        setIsLoading(true);
        editUser({...user, conf: null}).then(_ => {
            setRefetchValue(prev => prev + 1);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    const handleChange = (user, value) => {
        if(timer){
            clearTimeout(timer);
            const timerId = setTimeout(() => {
                editUser({...user, status: value});
                setRefetchValue(prev => prev + 1);
            }, 500);
            setTimer(timerId)
        }else{
            const timerId = setTimeout(() => {
                editUser({...user, status: value});
                setRefetchValue(prev => prev + 1);
            }, 500);
            setTimer(timerId)
        }
    }

    const tableData = 
        allUsers
            .map(
                item => 
                {
                    return (
                        {
                            name: item.firstName + ' ' 
                            + item.lastName + ' ' 
                            + item?.surname,
                            phone: item.phoneNumber,
                            tool: item.tool,
                            time: getTimeInTimezone(item.GMT).getHours() + ' ч.',
                            status: (<InputNumber className={styles.status} defaultValue={item?.status ?? 0} onChange={(value) => handleChange(item, value)}></InputNumber>),
                            button: item?.conf ? (
                                <>
                                    <a className={styles.conf} href={item.conf}>Конференция</a>
                                    <br />
                                    <Button type="danger" onClick={() => handleDeleteConf(item)} disabled={isLoading}>Удалить</Button>
                                </>
                            ) : (
                                <Button disabled={isLoading || !item?.status} onClick={() => handleCreateConf(item)}>Создать конференцию</Button>
                            )
                        }
                    )
                }
            )

    return (
        <Flex>
            <Table
                columns={columns}
                dataSource={tableData}
            />
        </Flex>
    )
}