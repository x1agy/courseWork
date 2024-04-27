import React from 'react';
import { Calendar } from 'antd';

const CalendarComponent = () => {
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return <Calendar onPanelChange={onPanelChange} fullscreen={false}/>;
};

export default CalendarComponent;