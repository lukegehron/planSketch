import axios from 'axios';
import {BASE_URL} from '../../../../constants';

/*
  Name: addTutorSubject
  Author: Colum Murphy

  This component makes a POST request to the server 
  with a new subject as a payload.
*/

const addTutorSubject = async (newSubject) => {

  const url = `${BASE_URL}subjects/create`;
  
  // Add user token to newSubject   
  newSubject.user = localStorage.token;
  
  const config = { headers:{ 'Content-Type' : 'application/json'} };

  try {
    const response = await axios.post(url, newSubject, config);    
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
      errObj.msg = 'Tutor Subjects and Availability - POST tutor subject'
      : errObj.msg = 'Tutor Subjects and Availability - Cannot connect to server';
    
    return errObj;  
  } 
}

export default addTutorSubject;
