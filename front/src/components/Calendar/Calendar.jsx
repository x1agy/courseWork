import React, { useContext, useState } from 'react';
import { Badge, Button, Calendar, Dropdown, Flex, Form, Input, Modal, Select, Space } from 'antd';

import styles from './calendar.module.css';
import { UserContext } from '../../App';
import { DownOutlined } from '@ant-design/icons';

const CalendarComponent = () => {
  
  const {userContext, setUserContext} = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (values) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    if(!userContext?.calendar?.length){
      const array = [];
      const dayArray = [];
      for(let i = 0; i < month; i++){
        array.push([]);
      }
      for(let i = 0; i < day; i++){
        dayArray.push([]);
      }
      setUserContext({...userContext, calendar: [...array, [...dayArray, [{tool: values.tool, activity: values.activity}]]]})
      return
    }
    const dayArray = [];
    for(let i = 0; i < (day - userContext.calendar[month].length); i++){
      dayArray.push([]);
    }
    const newCalendar = userContext.calendar;
    const lastMonth = newCalendar.pop();
    setUserContext(
      {
        ...userContext, 
        calendar: 
          [
            ...newCalendar, 
            [
              ...lastMonth, 
              ...dayArray, 
              [{tool: values.tool, activity: values.activity}]
            ]
          ]
        }
      )
  }

  const dateCellRender = (value) => {
    return (
      value.map(item => {
        if(item?.activity === 'active'){
          const items = [
            {
              key: '1',
              label: (
                <p className={styles.dropdownItem}>Инструмент: <h3>{item.tool}</h3></p>
              ),
            },
          ];
          return(
            <ul className={styles.event_active} key={1}>
              <Dropdown
                menu={{
                  items,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    Hover me
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </ul>
          )
        }else if (item?.activity === 'notActive'){
          return(
            <ul className={styles.events_not_active} key={Math.random()}></ul>
          )
        }else{
          return <></>
        }
      })
    );
  };
  
  const onCellRender = (current) => {
    const findDay = (userContext?.calendar ?? [])[current.$M]?.find((_, index) => current.$D === index)
    if(findDay?.length){
      return dateCellRender(findDay)
    }
  }

  return (
    <Flex vertical className={styles.calendarWrapper}>
      <Calendar 
        fullscreen={false} 
        className={styles.calendar} 
        cellRender={onCellRender}
      />
      <Button onClick={() => setIsModalOpen(true)} disabled={userContext?.calendar[new Date().getMonth()]?.length}>Добавить активность</Button>
      <Modal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form layout='vertical' onFinish={handleSubmit}>
          <Form.Item name='tool' label='Инструмент который вы изучали' rules={[{required: true, message: 'Заполните поле'}]}>
            <Input />
          </Form.Item>
          <Form.Item name='activity' label='Активность' rules={[{required: true, message: 'Заполните поле'}]}>
            <Select>
              <Select.Option value='active'>Активный</Select.Option>
              <Select.Option value='notActive'>Не активный</Select.Option>
            </Select>
          </Form.Item>
          <Button htmlType='submit'>Отправить</Button>
        </Form>
      </Modal>
    </Flex>
  )
};

export default CalendarComponent;