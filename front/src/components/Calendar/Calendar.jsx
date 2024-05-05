import React, { useContext, useState } from 'react';
import { Button, Calendar, Col, Dropdown, Flex, Form, Input, Modal, Radio, Row, Select, TimePicker, Typography } from 'antd';

import styles from './calendar.module.css';
import { UserContext } from '../../App';
import { DownOutlined } from '@ant-design/icons';

const monthsS = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"];

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
      setUserContext(
        {
          ...userContext, 
          calendar: 
            [
              ...array, 
              [
                ...dayArray, 
                [
                  {
                    tool: values.tool, 
                    activity: values.activity, 
                    comment: values.comment, 
                    playedTime: values.playedTime,
                    proizvedenie: values.proizvedenie
                  }
                ]
              ]
            ]
        }
      )
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
                  playedTime: values.playedTime,
                  proizvedenie: values?.proizvedenie
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
              <p className={styles.dropdownItem}><strong>Произведение: </strong>{item.proizvedenie}</p>
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
        <>
          <ul className={styles.events_not_active} key={Math.random()}></ul>
            <strong>{dedede}</strong>
        </>
      )
    }else{
      return <><strong>{dedede}</strong></>
    }
  };
  
  const onCellRender = (current) => {
    const day = userContext?.calendar?.[current.$M]?.find((_, index) => index === current.$D);
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
        headerRender={({ value, onChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];
          let current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current = current.month(i);
            months.push(localeData.monthsShort(current));
          }
          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className="month-item">
                {months[i]}
              </Select.Option>,
            );
          }
          const year = value.year();
          const month = value.month();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }
          return (
            <div
              style={{
                padding: 8,
                marginInlineStart: 'auto'
              }}
            >
              <Row gutter={8}>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    className="my-year-select"
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                  >
                    {options}
                  </Select>
                </Col>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    value={month}
                    onChange={(newMonth) => {
                      const now = value.clone().month(newMonth);
                      onChange(now);
                    }}
                  >
                    {monthOptions}
                  </Select>
                </Col>
              </Row>
            </div>
          );
        }}
      />
      <Button 
        onClick={() => setIsModalOpen(true)} 
        disabled={
          userContext
          ?.calendar
          ?.[new Date().getMonth()]
          ?.length - 1 === new Date().getDate()
          }>Добавить активность</Button>
      <Col>
          <strong>Сегодня {new Date().getDate()} {monthsS[new Date().getMonth()]}</strong>
      </Col>
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
            <Form.Item label='Произведение' name='proizvedenie' rules={[{required: true, message: 'Заполните поле'}]}>
              {
                userContext?.repertoire?.length ? (
                  <Select>
                    {userContext?.repertoire?.map(item => <Select.Option value={item.name}>{item.name}</Select.Option>)}
                  </Select>
                ) : (
                  <h3>Добавьте произведение в репертуар</h3>
                )
              }
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