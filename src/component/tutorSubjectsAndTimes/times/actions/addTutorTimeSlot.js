import axios from 'axios';
import {BASE_URL} from '../../../../constants';

/*
  Name: deleteTutorTimeSlot
  Author: Colum Murphy

  This component makes a POST request to the server
  to add a time slot/period of availability. 
*/


const addTutorTimeSlot = async (timeSlot) => {

  const config = { headers:{ 'Content-Type' : 'application/json'} };
  const url = `${BASE_URL}availabilites/create`;

  try {
    const response = await axios.post(url, timeSlot, config);
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

    error.response ? errObj.msg = 'Tutor Availability - POST new time slot'
                   : errObj.msg = 'Tutor Availability - Cannot connect to server';
    
    return errObj;  
  } 
}

export default addTutorTimeSlot;
