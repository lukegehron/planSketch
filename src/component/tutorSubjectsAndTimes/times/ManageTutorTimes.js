import { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import DateComponent from './DateComponent';
import TimeComponent from './TimeComponent';
import AvailableTimeList from './AvailableTimeList';
import DurationComponent from './DurationComponent';
import getTutorAvailability from './actions/getTutorAvailability';
import addTutorTimeSlot from './actions/addTutorTimeSlot';
import deleteTutorTimeSlot from './actions/deleteTutorTimeSlot';
import '../tutorSubjectsAndTimes.css';

/*
  Name: ManageTutorTimes
  Author: Colum Murphy

  This component allows tutors to add available dates and times to 
  their schedule.

  This component has 4 child components DateComponent, TimeComponent,
  AvailableTimeList and DurationComponent.
*/

const ManageTutorTimes = () => {

  // the tutor availability
  const [tutorAvailability, setTutorAvailability] = useState([]); 

  // all the tutor available dates, for calendar highlighting
  const [allAvailDates, setAllAvailDates] = useState([]);
  
  // the date selected by the user, from the calendar component
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
    
  // the selected date converted to a string, used for a useEffect hook
  const selectedDateString = selectedDate.toISOString();
  
  // all the time slots available, for the selected date
  const [timeSlotsForDate, setTimeSlotsForDate] = useState([]);
  
  // the new start date and time the user wants to add to available times
  const [newStartDateTime, setNewStartDateTime] = useState(currentDate);

  // set 30 minutes as the default time slot duration 
  const [timeSlotDuration, setTimeSlotDuration] = useState(30);

  // state used by the Alert component to show messages
  const [showAlert, setShowAlert] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('info');


  useEffect(() => {
    const getAvailability = async () => {
      // get tutor availability data
      const result = await getTutorAvailability();    
      const { error, msg, data, status } = result;   
      
      // if there is an error, show a message and send to console
      if (error) {
        showMessage('Error Connecting to Server!', 'danger');
        handleError({status: status, msg: msg});      
        return;
      } 
      // convert response data, change date string to date object    
      convertData(data.data);
    }

    getAvailability();
  // eslint-disable-next-line
  }, []);

 
  // update, when the tutor availability, or the date selected in calendar changes
  useEffect(() => {

    // filter the tutor availability for time slots that match
    // the date selected in the calendar
    const matchingTimeSlots = tutorAvailability.filter(item => 
      (equalDates(item.startDateTime, selectedDate)));

      setTimeSlotsForDate(matchingTimeSlots);
  // eslint-disable-next-line
  }, [selectedDateString, tutorAvailability]);


  // update the available dates state (highlight dates)
  // when the the tutor availability changes
  useEffect(() => {
    // map the tutor availability to a dates only array
    const datesArray = tutorAvailability.map(item => {
      return item.startDateTime;
    });
    setAllAvailDates(datesArray);
  }, [tutorAvailability]);


  // Convert the time string in each object to a date object.
  // Filter out any time slots that have a start time before the current time. 
  const convertData = (timeStringArray) => {

    const dateObjectArray = timeStringArray.map(item => {
      return {
        id: item._id,
        startDateTime: new Date(item.timeslotStart),
        endDateTime: new Date(item.timeslotEnd)
      }
    });

    // filter array for start times in the future
    const dateTimeNow = new Date();
    const futureTimeAndDate = dateObjectArray.filter(item => 
      item.startDateTime > dateTimeNow );

    // sort by date + time  
    futureTimeAndDate.sort((a,b) => { 
      return a.startDateTime.getTime() - b.startDateTime.getTime() });

    // set tutor availability
    setTutorAvailability(futureTimeAndDate);
  }  


  // Function returns true if year, month and date match for 2 date objects
  const equalDates = (dateA, dateB) => {
    if (dateA.getFullYear() === dateB.getFullYear()
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getDate() === dateB.getDate() ) {
      return true;
    } 
    return false;
  }


  // show a message for 3 seconds 
  const showMessage = (msgText, msgType) => {
    // show a message 
    setMessageText(msgText);
    setMessageType(msgType);
    setShowAlert(true);

    // hide the message after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  }

  /*
    Function deletes a specific time slot for the user.
    It makes a delete request to the server and also updates 
    the tutor availability state.    */
  const deleteTimeSlot = async (timeSlotId) => {

    const result = await deleteTutorTimeSlot(timeSlotId);    
    const { error, msg, status } = result;   
    
    // if there is an error, show a message and send to console
    if (error) {
      showMessage('Error Connecting to Server!', 'danger');
      handleError({status: status, msg: msg});      
      return;
    } 

    // remove the time slot from the tutor available time slots
    const remainingTimeSlots = tutorAvailability.filter(item => 
          item.id !== timeSlotId);
  
    // update the tutor availability state      
    setTutorAvailability(remainingTimeSlots); 

    // show a success message to the user
    showMessage('Time slot deleted', 'success');
  }


  /*
    Function adds a specific time slot for the user.
    It makes a post request to the server and also updates 
    the tutor availability state.    */
  const addTimeSlot = async () => {

    // Check if the time slot start time is in the past
    const dateAndTimeNow = new Date();
    if(newStartDateTime < dateAndTimeNow) {
      showMessage('Selected start time is in the past', 'info');
      return;
    }

    // calculate an end time from the selected start date and time
    const endTime = newStartDateTime.getTime() + timeSlotDuration * 60000;
    const newEndDateTime = new Date(endTime);

    // check that the new time slot does not overlap with other timeslots 
    const timeOverLap = tutorAvailability.some(item => {
      return !(
        newStartDateTime.getTime() >= item.endDateTime.getTime()
        || newEndDateTime.getTime() <= item.startDateTime.getTime()
      )
    })

    // if there is an overlap in time slots show a message
    if (timeOverLap) {
      showMessage('Selected time overlaps with existing time slot', 'info');
      return;
    }

    // new time slot object
    const newTimeSlot = {
      timeslotStart: newStartDateTime.toString(),
      timeslotEnd: newEndDateTime.toString(),
      user: localStorage.token
    }
    
    // make a request to the backend
    const result = await addTutorTimeSlot(newTimeSlot);    
    const {error, msg, data, status} = result; 
    
    // if there is an error, show a message and send to console
    if (error) {
      showMessage('Error Connecting to Server!', 'danger');
      handleError({status: status, msg: msg});      
      return;
    } 

    // convert the response data to a new object 
    const convertedTimeSlot = { 
      id: data[0]._id,
      startDateTime: new Date(data[0].timeslotStart),
      endDateTime: new Date(data[0].timeslotEnd)
    }
    
    // add object and sort
    const newTutorAvailability = [...tutorAvailability, convertedTimeSlot];
    newTutorAvailability.sort((a,b) => { 
      return a.startDateTime.getTime() - b.startDateTime.getTime() });

    // update the tutorAvailability state
    setTutorAvailability(newTutorAvailability);

    // show a success message to the user
    showMessage('Time slot added', 'success');
  }


  // send error to console
  const handleError = (errorObj) => {                
    if(errorObj.status) {
      console.log(`Status: ${errorObj.status}`);
    }
    if(errorObj.msg) {
      console.log(`Message: ${errorObj.msg}`);
    } 
  }  


  return (
    <div>

      <DateComponent 
        changeSelectedDate={(date) => setSelectedDate(date) } 
        datesToHighlight={allAvailDates}              
      />

      <div className='w5a_flexRowContainer'>
        <div className='w5a_flexRowItem'>          
          <div className="w5a_flexColumnContainer">
            <div>
              <div>
                Select Time
              </div>
              <TimeComponent 
                selectedDate={selectedDate}
                changeTime={(date) => setNewStartDateTime(date)}
              />
            </div>
            <DurationComponent 
              changeDuration={(duration) => setTimeSlotDuration(duration)}
            />
            <div className="w5a_addTimeSlotButton">
              <Button onClick={addTimeSlot}>
                Add Available Time
              </Button>
            </div>
          </div>
        </div>      
        <div className='w5a_flexRowItem'>
          <div className="listHeading">
            Available Times
          </div>
          <AvailableTimeList
            timeSlotsForDate={timeSlotsForDate}
            deleteTimeSlot={(timeSlotId) => deleteTimeSlot(timeSlotId)}
          />
        </div>
      </div>

      <div className='w5a_alertMessage'>
        <Alert transition={false} show={showAlert} variant={messageType}>
          {messageText}
        </Alert>  
      </div>
    </div>
  )
}

export default ManageTutorTimes;
