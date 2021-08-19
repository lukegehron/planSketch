import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import "react-datepicker/dist/react-datepicker.css";
import '../tutorSubjectsAndTimes.css';

/*
  Name: DateComponent
  Author: Colum Murphy

  This component allows the user to select a date on a calendar.
  The selected date is passed up to the parent component using
  the changeSelectedDate prop.   
*/

const DateComponent = (props) => {

  const {changeSelectedDate, datesToHighlight} = props;

  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const [highlightDates, setHighlightDates] = useState([]);

  // selected date converted to a string
  const selectedDateString = selectedDate.toISOString();

  // pass a new date to parent component
  useEffect( () => {
    changeSelectedDate(selectedDate);
  // eslint-disable-next-line
  }, [selectedDateString]); 
  
  // update highlighted dates
  useEffect( () => {
    setHighlightDates(datesToHighlight);
  }, [datesToHighlight]);

  // on click of the calendar, change the selected date
  const onChange = (date) => {         
    setSelectedDate(date);
  }

  // This function sets a new selected date when the components 
  // month change arrows are clicked.
  const onMonthChange = (dateChangedTo) => {

    // get the new date  
    let cloneDate = new Date(dateChangedTo); 
    
    // set the day to the 15th of the month
    cloneDate.setDate(15);
    
    // if the new date is before the current date
    if ( !compareDates(currentDate, cloneDate) ) {      
      // set the new date to the current date
      cloneDate = new Date(currentDate);
    }

    // set the selected date
    setSelectedDate(cloneDate);   
  }  

  // This function sets a new selected date when the external 
  // month forward arrow is clicked.
  const moveMonthForward = () => {

    // copy selected date
    let cloneDate = new Date(selectedDate);
    let month = cloneDate.getMonth();
    let year = cloneDate.getFullYear();

    // calculate a new month and year
    if (month === 11) {
      month = 0;
      year = year + 1;
    } else {
      month = month + 1;
    }

    // set the month, and the year, and set the day to 15th
    cloneDate.setMonth(month);
    cloneDate.setFullYear(year);
    cloneDate.setDate(15);

    // set the new selected date
    setSelectedDate(cloneDate);
  }

  const moveMonthBack = () => {

    // if the calendar is displaying the current month + year
    // don't go to a previous date
    if (currentDate.getMonth() === selectedDate.getMonth()
      && currentDate.getFullYear() === selectedDate.getFullYear()) {
      return;    
    }

    // copy selected date
    let cloneDate = new Date(selectedDate);
    let month = cloneDate.getMonth();
    let year = cloneDate.getFullYear();

    // this code calculates new months and years
    if (month === 0) {
      month = 11;
      year = year - 1;
    } else {
      month = month - 1;
    }    
    let day = 15;

    // set the month, year and day
    cloneDate.setMonth(month);
    cloneDate.setFullYear(year);
    cloneDate.setDate(day);    

    // if the new date is before the current date
    if ( !compareDates(currentDate, cloneDate) ) {      
      // set the new date to the current date
      cloneDate = new Date(currentDate);
    }
    
    // set the new selected date
    setSelectedDate(cloneDate);
  }

  // Returns true if date2 is later, false otherwise
  const compareDates = (date1, date2) => {
    return new Date(date2) > new Date(date1);
  }

  return (
    <>
      <div className='w5a_dateComponentWrapper'> 
        
        <div>
          <div className='w5a_calendarTitleContainer'>
            <div className='w5a_calendarTitle'>   
              <div className='w5a_arrowLeft'>
                <BsArrowLeft
                  id='monthBackArrow'
                  style={arrowStyle}
                  onClick={moveMonthBack}
                />
              </div> 
              <div className='w5a_calendarText'>
                Calendar
              </div>
              <div className='w5a_arrowRight'>
                <BsArrowRight
                  id='monthForwardArrow'
                  style={arrowStyle}
                  onClick={moveMonthForward}
                />
              </div>
            </div>
          </div>
        </div>
        <DatePicker      
          wrapperClassName="w5a_datepicker"
          selected={selectedDate}          
          onChange={(date) => onChange(date)}
          minDate={currentDate}
          onMonthChange={onMonthChange}          
          peekNextMonth={false}
          monthsShown={1}
          inline
          highlightDates={highlightDates}
        />

      </div>
    </>
  )
}

const arrowStyle = {
  width: '20px',
  height: '20px',
  color: 'blue', 
  backgroundColor: 'lightgray', 
  cursor: 'pointer'
}

export default DateComponent;