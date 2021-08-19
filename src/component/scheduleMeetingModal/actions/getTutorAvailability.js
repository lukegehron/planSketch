import axios from 'axios';
import {BASE_URL} from '../../../constants';

/*
  Name: getTutorAvailability
  Author: Colum Murphy

  This component makes a GET request to the server 
  and returns the date/time availability for a specific tutor(userId).
*/

const getTutorAvailability = async (userId) => {

  const url = `${BASE_URL}availabilites/list/${userId}?id=${localStorage.token}`;

  try {
    const response = await axios.get(url);
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

    error.response ? errObj.msg = 'Schedule Meeting Modal - GET tutor availability'
                   : errObj.msg = 'Schedule Meeting Modal - Cannot connect to server';
    
    return errObj;    
  } 
}

export default getTutorAvailability;
