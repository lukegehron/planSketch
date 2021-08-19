import axios from 'axios';
import {BASE_URL} from '../../../../constants';

/*
  Name: deleteTutorTimeSlot
  Author: Colum Murphy

  This component makes a DELETE request to the server  
  to delete a time period/slot that has been scheduled for a meeting.
*/

const deleteTutorTimeSlot = async (timeSlotId) => {

  const url = `${BASE_URL}availabilites/delete/${timeSlotId}`;
  const body = { user: localStorage.token };
  const config = { headers:{ 'Content-Type' : 'application/json'} };

  try {
    const response = await axios.post(url, body, config);
    return { 
      error: false, 
      msg: '', 
      data: response.data,
      status: response.status   
    };

  } catch (error) {   
    
    const errObj = { error: true, data: null }

    error.response ? errObj.status = error.response.status 
                   : errObj.status = null;

    error.response ? errObj.msg = 'Tutor Availability - DELETE tutor time slot'
                   : errObj.msg = 'Tutor Availability - Cannot connect to server';
    
    return errObj; 
  } 
}

export default deleteTutorTimeSlot;
