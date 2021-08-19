import {BsXCircleFill} from 'react-icons/bs';
import '../tutorSubjectsAndTimes.css';

/*
  Name: AvailableTimeList
  Author: Colum Murphy

  This component shows the time slots available for a specific date.
  The component allows the user to delete a time slot.
  The id of the time slot deleted by user is passed up to the 
  parent component. 
*/

const AvailableTimeList = (props) => {

  const {timeSlotsForDate, deleteTimeSlot} = props;
  
  // format the startDateTime and endDateTime 
  // to display a start and end time to the user
  const formatTime = (startDateTime, endDateTime) => {    

    // get the start time, no specific locale, use the users locale
    const startTime = startDateTime.toLocaleString([], 
                        { hour: 'numeric', minute: '2-digit' });

    // get the end time, no specific locale, use the users locale
    const endTime = endDateTime.toLocaleString([], 
                        { hour: 'numeric', minute: '2-digit' });
    
    return `${startTime} - ${endTime}`;
  }

  return (
    <div className='w5a_itemsContainer'>
      { timeSlotsForDate.map(timeSlot => {
        return (
          <div 
            key={timeSlot.id}
            className='w5a_itemStyle' 
          >
            <div>
              {formatTime(timeSlot.startDateTime, timeSlot.endDateTime)}
            </div>              
            <BsXCircleFill
              id='deleteTimeSlotIcon'
              style={w5a_deleteTimeSlotIcon}
              onClick={() => deleteTimeSlot(timeSlot.id)}
            />
          </div>
        )
      })}      
    </div>
  )
}

const w5a_deleteTimeSlotIcon = {
  color: '#FF0000', 
  cursor: 'pointer',
  flex: '0 0 1rem'
}

export default AvailableTimeList;
