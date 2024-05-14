import { Button, Flex, InputNumber, Table } from "antd";
import { getTimeInTimezone } from "../../utils/default";
import { createConf, editUser } from "../../utils/api";
import { useEffect, useState } from "react";

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
        title: 'Сколько лет учится',
        dataIndex: 'spendTime'
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

export const UsersList = ({allUsers: users, setRefetchValue}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const [allUsers, setAllUsers] = useState(users);

    useEffect(() => {
        setAllUsers(users)
    }, [users])

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

    console.log(allUsers)

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
                            time: getTimeInTimezone(item.GMT).toString().match(/\d\d:\d\d/),
                            status: (<InputNumber className={styles.status} value={item?.status ?? 0} onChange={(value) => handleChange(item, value)}></InputNumber>),
                            spendTime: item?.spendTime ?? 1,
                            button: item?.conf ? (
                                <>
                                    <a target="_blank" className={styles.conf} style={{backgroundColor: 'white', border: '1px solid gray', padding: '5px', borderRadius: '5px'}} href={item.conf}>Конференция</a>
                                    <br />
                                    <Button type="primary" style={{width: '7em', backgroundColor: 'red', maxWidth: "6em", marginTop: '8px'}} onClick={() => handleDeleteConf(item)} disabled={isLoading}>Удалить</Button>
                                </>
                            ) : (
                                <Button style={{backgroundColor: 'white'}} disabled={isLoading || !item?.status} onClick={() => {
                                    handleCreateConf(item);
                                    setAllUsers(prev => {
                                        return prev.map(obj => obj._id === item._id ? {...obj, status: item.status - 1} : obj)
                                    })
                                }}>Создать конференцию</Button>
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
                rowClassName={(obj) => {
                    if((obj.status.props.value ?? 0) < 2){
                        return styles.danger
                    }
                }}
            />
        </Flex>
    )
}