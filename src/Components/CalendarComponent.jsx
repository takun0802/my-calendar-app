// src/components/CalendarComponent.jsx
import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={date}
      />
      <p>選択中の日付: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarComponent;
