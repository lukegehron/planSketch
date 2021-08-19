import axios from 'axios';
import {BASE_URL} from '../../../../constants';

/*
  Name: deleteTutorSubject
  Author: Colum Murphy

  This component makes a DELETE request to the server, 
  to delete a tutor subject with a specific subjectId.
*/

const deleteTutorSubject = async (subjectId) => {

  const url = `${BASE_URL}subjects/delete/${subjectId}`;
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

    error.response ? 
      errObj.msg = 'Tutor Subjects and Availability - DELETE tutor subject'
      : errObj.msg = 'Tutor Subjects and Availability - Cannot connect to server';
    
    return errObj;   
  }
}

export default deleteTutorSubject;
