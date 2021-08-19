import axios from 'axios';
import {BASE_URL} from '../../../../constants'

/*
  Name: getTutorSubjects
  Author: Colum Murphy

  This component makes a GET request to the server 
  and returns the subjects for a specific tutor.
*/

const getTutorSubjects = async () => {
  
  const url = `${BASE_URL}subjects/list/${localStorage.token}`;

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

    error.response ? 
      errObj.msg = 'Tutor Subjects and Availability - GET tutor subjects'
      : errObj.msg = 'Tutor Subjects and Availability - Cannot connect to server';
    
    return errObj;      
  }  
}

export default getTutorSubjects;
