import React, { useContext, useState } from 'react';
import { Button, Calendar, Dropdown, Flex, Form, Input, Modal, Select, TimePicker } from 'antd';

import styles from './calendar.module.css';
import { UserContext } from '../../App';
import { DownOutlined } from '@ant-design/icons';

const CalendarComponent = () => {
  
  const {userContext, setUserContext} = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotActive, setIsNotActive] = useState(false);

  const handleSubmit = (values) => {
    setIsModalOpen(false);
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
    if(userContext.calendar.length - 1 < month){
      userContext.calendar.push([])
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
              [
                {
                  tool: values.tool, 
                  activity: values.activity,
                  comment: values?.comment,
                  playedTime: values.playedTime
                }
              ]
            ]
          ]
        }
      )
  }

  const dateCellRender = (value, dedede) => {
    const item = value[0];
    if(item?.activity === 'active'){
      const items = [
        {
          key: item.playedTime,
          label: (
            <div>
              <p className={styles.dropdownItem}><strong>Инструмент:</strong> {item.tool}</p>
              <p className={styles.dropdownItem}><strong>Время занятий:</strong> {new Date(item.playedTime).getMinutes()} минут</p>
              {item?.comment && <p className={styles.dropdownItem}><strong>Коментарий:</strong> {item?.comment}</p>}
            </div>
          ),
        },
      ];
      return(
        <>
          <ul className={styles.event_active} key={item.playedTime}>
          <Dropdown
            menu={{
              items,
            }}
          >
              <DownOutlined />
          </Dropdown>
        </ul>
        <strong>{dedede}</strong>
        </>
      )
    }else if (item?.activity === 'notActive'){
      return(
        <ul className={styles.events_not_active} key={Math.random()}><strong>{dedede}</strong></ul>
      )
    }else{
      return <><strong>{dedede}</strong></>
    }
  };
  
  const onCellRender = (current) => {
    const day = userContext?.calendar[current.$M]?.find((_, index) => index === current.$D);
    if(day?.length > 0 && userContext.password){
      return dateCellRender(day, current.$D)
    }else{
      return <strong>{current.$D}</strong>
    }
  }

  return (
    <Flex vertical className={styles.calendarWrapper}>
      <Calendar 
        fullscreen={false} 
        className={styles.calendar} 
        fullCellRender={onCellRender}
      />
      <Button 
        onClick={() => setIsModalOpen(true)} 
        disabled={
          userContext
          ?.calendar
          ?.[new Date().getMonth()]
          ?.length - 1 === new Date().getDate()
          }>Добавить активность</Button>
      <Modal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form layout='vertical' onFinish={handleSubmit}>
          <Form.Item name='activity' label='Активность' rules={[{required: true, message: 'Заполните поле'}]}>
            <Select onChange={(i) => i === 'notActive' ? setIsNotActive(true) : setIsNotActive(false)}>
              <Select.Option value='active'>Активный</Select.Option>
              <Select.Option value='notActive'>Не активный</Select.Option>
            </Select>
          </Form.Item>
          {!isNotActive && (
            <Form.Item name='tool' label='Инструмент который вы изучали' rules={[{required: true, message: 'Заполните поле'}]}>
              <Input />
            </Form.Item>
          )}
          {!isNotActive && (
            <Form.Item label='Время занятий' name='playedTime' rules={[{required: true, message: 'Заполните поле'}]}>
              <TimePicker/>
            </Form.Item>
          )}
          {!isNotActive && (
            <Form.Item label="Коментарий" name='comment'>
              <Input.TextArea/>
            </Form.Item>
          )}
          <Button htmlType='submit'>Отправить</Button>
        </Form>
      </Modal>
    </Flex>
  )
};

export default CalendarComponent;