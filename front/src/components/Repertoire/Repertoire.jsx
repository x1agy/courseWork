import { Table } from "antd";
import React, { useContext } from "react";
import { UserContext } from "../../App";

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      showSorterTooltip: {
        target: 'full-header',
      },
      filters: [
        {
          text: 'Joe',
          value: 'Joe',
        },
        {
          text: 'Jim',
          value: 'Jim',
        },
        {
          text: 'Submenu',
          value: 'Submenu',
          children: [
            {
              text: 'Green',
              value: 'Green',
            },
            {
              text: 'Black',
              value: 'Black',
            },
          ],
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
    },
    {
      title: 'Age',
      dataIndex: 'age',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },
  ];

const Repertoire = () => {

    const {userContext} = useContext(UserContext);

    return (
        <Table
            columns={columns}
            dataSource={userContext?.repertoire}
            showSorterTooltip={{
                target: 'sorter-icon',
            }}
        />
    )
}

export default Repertoire