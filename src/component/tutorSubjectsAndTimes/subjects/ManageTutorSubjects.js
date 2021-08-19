import {useState, useEffect} from 'react';
import { Alert } from 'react-bootstrap';
import SubjectItemList from './SubjectItemList';
import SubjectInput from './SubjectInput';

import getTutorSubjects from './actions/getTutorSubjects';
import addTutorSubject from './actions/addTutorSubject';
import deleteTutorSubject from './actions/deleteTutorSubject';

import '../tutorSubjectsAndTimes.css';

/*
  Name: ManageTutorSubjects
  Author: Colum Murphy

  This component adds to, deletes from, and displays the tutors 
  subjects list.  This component has 2 child components SubjectItemList
  and SubjectInput.
*/

const ManageTutorSubjects = () => {

  // tutor subjects state
  const [tutorSubjects, setTutorSubjects] = useState([]);

  // state used by the Alert component to show messages
  const [showAlert, setShowAlert] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('info');


  useEffect( () => {
    const getSubjects = async () => {        
      const result = await getTutorSubjects();  
      const { error, msg, data, status } = result;
      
      // if there is an error, show a message, and send to console      
      if (error) {
        showMessage('Error Connecting to Server!', 'danger');
        handleError({status: status, msg: msg});         
        return;
      } 
      // convert the data
      convertData(data.data);
    }
    getSubjects();
  // eslint-disable-next-line
  }, []);


  // convert the data from the server
  const convertData = (subjectData) => {

    // get the subjects
    const subjects = subjectData.subjects;

    // map data to new format
    const subjectsArray = subjects.map(item => {
      return {
        id: item._id,
        subject: item.subject,
        description: item.description
      }
    });

    // update tutor subjects state
    setTutorSubjects(subjectsArray); 
  }


  // Function deletes a subject from the list of subjects.
  const deleteSubject = async (subjectId) => {

    const result = await deleteTutorSubject(subjectId);
    const { error, msg, status } = result;
    
    // if there is an error, show a message, and send to console
    if (error) {
      showMessage('Error Connecting to Server!', 'danger');
      handleError({status: status, msg: msg});         
      return;
    } 

    // filter using the subject id
    const filteredSubjects = 
      tutorSubjects.filter(tutorSubject => tutorSubject.id !== subjectId);

    // update the tutorSubjects state 
    setTutorSubjects(filteredSubjects);

    // show success message
    showMessage('Subject deleted.', 'success');
  }


  // Function adds a subject to the list of subjects.
  const addNewSubject = async (newSubject) => {

    const result = await addTutorSubject(newSubject);
    const { error, msg, data, status } = result;
      
    // if there is an error, show a message and send to console
    if (error) {
      showMessage('Error Connecting to Server!', 'danger');
      handleError({status: status, msg: msg});         
      return;
    } 
    
    // convert returned data
    const convertedSubject = {
      id: data._id,
      subject: data.name,
      description: data.description
    } 

    // add new subject (including subject id), to the tutor subjects array 
    const newTutorSubjects = [...tutorSubjects, convertedSubject];      

    // update the tutorSubjects state
    setTutorSubjects(newTutorSubjects);

    // show success message
    showMessage('Subject added.', 'success');
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


  // send errors to the console
  const handleError = (errorObj) => {                
    if(errorObj.status) {
      console.log(`Status: ${errorObj.status}`);
    }
    if(errorObj.msg) {
      console.log(`Message: ${errorObj.msg}`);
    } 
  }  


  return (    
    <div className='w5a_subjectContainer'>
      <div className='w5a_listHeading'>
        Tutor Subjects
      </div>  
      <SubjectItemList 
        tutorSubjects={tutorSubjects} 
        deleteSubject={deleteSubject} 
      />
      <SubjectInput 
        addNewSubject={addNewSubject}
        handleInputError={ (errObj) => showMessage(errObj.msg, 'info') }
      />
      <div className='w5a_alertMessage'>
        <Alert 
          transition={false} 
          show={showAlert} 
          variant={messageType}
        >
          {messageText}
        </Alert>  
      </div>
    </div>
  )
}

export default ManageTutorSubjects;
