import { Button, Flex, Form, Input, Modal, Select, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";

import styles from './Repertoire.module.css';
import { useTranslation } from "react-i18next";


const Repertoire = ({userContextProp}) => {
  
  const {userContext: globalUserContext, setUserContext} = useContext(UserContext);
  let userContext = userContextProp ?? globalUserContext
  const [isOpen, setIsOpen] = useState(false);
  const selectedField = useRef(null)
  const [form] = Form.useForm();
  const {t} = useTranslation()

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
    },
    {
      title: t('genre'),
      dataIndex: 'genre',
    },
    {
      title: t('instrument'),
      dataIndex: 'tool',
    },
    {
      title: t('composer'),
      dataIndex: 'compositor',
    },
    {
      title: t('link1'),
      dataIndex: 'musicLink',
    },
    {
      title: t('stage'),
      dataIndex: 'asdasd',
    },
    {
      title: t('link2'),
      dataIndex: 'linkToMusic'
    },
    {
      title: t('status'),
      dataIndex: 'status'
    },
    {
      title: '',
      dataIndex: 'button'
    }
  ];
  
  const selectFields = [t('analysis'), t('grinding'), t('memorize')];
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
      <Flex vertical>
        <Button onClick={() => {
          setIsOpen(true);
          selectedField.current = index;
        }} style={{marginBottom: '20px', width: '7em'}}>{t('edit')}</Button>
        <Button type="primary" style={{width: '7em', backgroundColor: 'red'}} onClick={() => handleDelete(index)}>
          {t('delete')}
        </Button>
      </Flex>
    ), key: index}))

    useEffect(() => {
      form.setFieldValue(userContext?.repertoire?.[selectedField.current])
    }, [form, isOpen, selectedField, userContext?.repertoire])

    return (
        <Flex vertical style={{ overflowX: 'auto', width: '100%' }}>

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
          }}>{t('add')}</Button>

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
                        rules={[{min: 3, message: t('error1')}, {required: true, message: t('error6')}]} 
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
                        rules={[{min: 3, message: t('error1')}, {required: true, message: t('error6')}]} 
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

                <Button htmlType="submit">{t('send')}</Button>
              </Form>
          </Modal>
        </Flex>
    )
}

export default Repertoire