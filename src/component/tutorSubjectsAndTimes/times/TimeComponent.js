import {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/*
  Name: TimeComponent
  Author: Colum Murphy

  This component allows the user to set the time of a date object.
  When the component gets a new date from the selectedDate prop
  the time is set to the default (12 noon).
  
  The user selects a time and this value is passed to the parent 
  component using the changeTime prop.
*/

const TimeComponent = (props) => {

  const { selectedDate, changeTime } = props;

  // selected date, converted to string for useEffect hook
  const selectedDateString = selectedDate.toISOString();

  // selected date, with a specific time set
  const [dateAndTime, setDateAndTime] = useState(new Date());
  
  // date and time, converted to string for useEffect hook
  const dateAndTimeString = dateAndTime.toISOString();


  // if the selected date changes, update the date and time
  useEffect(() => {

    // copy the date + set time to noon
    const newDate = new Date(selectedDate);
    newDate.setHours(12, 0, 0, 0);
    setDateAndTime(newDate);
  // eslint-disable-next-line  
  }, [selectedDateString]);


  // if the date and time changes, update the parent component 
  useEffect(() => {    
    changeTime(dateAndTime);

  // eslint-disable-next-line
  }, [dateAndTimeString]);


  return (
    <DatePicker
      selected={dateAndTime}
      onChange={(date) => setDateAndTime(date)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"

      popperPlacement="left"
    />
  );
}

export default TimeComponent;
