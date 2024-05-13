import { Button, Flex, Form, Input, Modal, Select, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";

import styles from './Repertoire.module.css';

const columns = [
  {
    title: 'Название',
    dataIndex: 'name',
  },
  {
    title: 'Жанр',
    dataIndex: 'genre',
  },
  {
    title: 'Инструмент',
    dataIndex: 'tool',
  },
  {
    title: 'Композитор',
    dataIndex: 'compositor',
  },
  {
    title: 'Ссылка на ноты',
    dataIndex: 'musicLink',
  },
  {
    title: 'Стадия',
    dataIndex: 'asdasd',
  },
  {
    title: 'Ссылка на медиа',
    dataIndex: 'linkToMusic'
  },
  {
    title: 'Статус',
    dataIndex: 'status'
  },
  {
    title: '',
    dataIndex: 'button'
  }
];

const selectFields = ['разбор', 'шлифовка', 'наизусть'];

const Repertoire = ({userContextProp}) => {

    const {userContext: globalUserContext, setUserContext} = useContext(UserContext);
    let userContext = userContextProp ?? globalUserContext
    const [isOpen, setIsOpen] = useState(false);
    const selectedField = useRef(null)
    const [form] = Form.useForm();

    const handleDelete = (deleteIndex) => {
      const repertoire = userContext?.repertoire;
      const sameObj = userContext?.repertoire?.find((_, index) => index === deleteIndex);
      const newRepertoire = repertoire.filter(item => {
        if(JSON.stringify(item) === JSON.stringify(sameObj)){
          return false
        }else{
          return true
        }
      })
      setUserContext({...userContext, repertoire: [...newRepertoire]});
    }

    const handleSubmit = (values) => {
      const repertoire = userContext?.repertoire;
      const sameObj = userContext?.repertoire?.find((_, index) => index === selectedField.current);
      if(sameObj?.name){
        const newRepertoire = repertoire.map(item => {
          if(JSON.stringify(item) === JSON.stringify(sameObj)){
            return values
          }else{
            return item
          }
        })
        setUserContext({...userContext, repertoire: [...newRepertoire]});
      }else{
        setUserContext({...userContext, repertoire: [...(repertoire ?? []), values]});
      }
      setIsOpen(false);
      selectedField.current = null;
      form.resetFields()
    }

    const tableData = userContext?.repertoire?.map(item => {
      const length = Object.values(item).filter(item => !!item?.length).length;
      if(length  < 6) return ({...item, status: 'В планах'});
      else if (length === 6) return ({...item, status: 'В работе'});
      else return {...item, status: 'Готово'}
    }).map((item, index) => ({...item, button: (
      <>
        <Button onClick={() => {
          setIsOpen(true);
          selectedField.current = index;
        }} style={{marginBottom: '20px', width: '7em'}}>Изменить</Button>
        <Button type="primary" style={{width: '7em', backgroundColor: 'red'}} onClick={() => handleDelete(index)}>
          Удалить
        </Button>
      </>
    ), key: index}))

    useEffect(() => {
      form.setFieldValue(userContext?.repertoire?.[selectedField.current])
    }, [form, isOpen, selectedField, userContext?.repertoire])

    return (
        <Flex vertical>

          <Table
              columns={columns}
              dataSource={tableData}
              style={{textAlign: 'center'}}
              showSorterTooltip={{
                  target: 'sorter-icon',
              }}
              className={styles.table}
              rowClassName={(obj) => {
                const length = Object.values(obj).filter(item => !!item?.length).length;
                if(length === 6){
                  return styles.plans
                }else if(length === 7){
                  return styles.going
                }else if(length === 8){
                  return styles.complete
                }
              }}
          />

          <Button onClick={() => {
            setIsOpen(true);
          }}>Добавить произведение</Button>

          <Modal footer={false} open={isOpen} destroyOnClose={true} onCancel={() => {
            setIsOpen(false);
            selectedField.current = null
          }} centered>

              <Form layout="vertical" onFinish={handleSubmit} form={form}>
                {columns.slice(0, String(selectedField.current) === 'null' ? 5 : Object.keys(userContext?.repertoire?.[selectedField.current]).length === 5 ? 6 : 7).map((item, index) => {
                  if(item.dataIndex === 'asdasd'){
                    return (
                      <Form.Item 
                        label={item.title} 
                        rules={[{min: 3, message: 'Заполните поле'}, {required: true, message: 'Заполните поля'}]} 
                        name={item.dataIndex} 
                        key={index} 
                        initialValue={
                          userContext
                          ?.repertoire
                          ?.[selectedField.current]
                          ?.[item.dataIndex] ?? ''
                        }>
                         <Select>
                          {selectFields.map(item => <Select.Option value={item} >{item}</Select.Option>)}
                         </Select>
                      </Form.Item>
                    )
                  }else{
                    return (
                      <Form.Item 
                        label={item.title} 
                        rules={[{min: 3, message: 'Заполните поле'}, {required: true, message: 'Заполните поля'}]} 
                        name={item.dataIndex} 
                        key={index} 
                        initialValue={
                          userContext
                          ?.repertoire
                          ?.[selectedField.current]
                          ?.[item.dataIndex] ?? ''
                        }>
                        <Input/>
                      </Form.Item>
                    )
                  }
                })}

                <Button htmlType="submit">Отправить</Button>
              </Form>
          </Modal>
        </Flex>
    )
}

export default Repertoire