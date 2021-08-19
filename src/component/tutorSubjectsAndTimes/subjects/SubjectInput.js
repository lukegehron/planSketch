import React from 'react';
import { Button } from 'react-bootstrap';
import '../tutorSubjectsAndTimes.css';

/*
  Name: SubjectInput
  Author: Colum Murphy

  This component allows the user to add a new subject item
  to the tutor subject list.  Invalid data in any input field
  results in a error message being passed to the parent component. 
*/

const SubjectInput = (props) => {

  const { addNewSubject, handleInputError } = props;   

  const [newSubject, setNewSubject] = React.useState({
    subject: '',
    description: '',
  });

  // This function is called when a input field is changed
  const onChange = (e) => {
    setNewSubject({ ...newSubject, [e.target.name]: e.target.value }); 
  }
  
  // This function is called when the Add New Subject button is clicked
  const onAddButtonClick = () => {

    // Check if either input field is empty
    if (isInputEmpty()) {
      // return an error message to the parent component
      handleInputError(
        { msg: 'Please enter a value for Subject and Description'});
      return;             
    }

    // Check if either input field value is too long/large 
    if (isInputTooLong()) {
      // return an error message to the parent component
      handleInputError(
        { msg: 'Too many characters for Subject(max=100) or Description(max=250)'});
      return; 
    }

    // trim the new subject  
    const trimmedSubject = {
      subject: newSubject.subject.trim(),
      description: newSubject.description.trim()
    }

    // add the new subject to the tutor subjects list
    addNewSubject(trimmedSubject);

    // clear the subject and description fields
    setNewSubject({ subject: '', description: '' });    
  }

  // This function checks if either input field is empty
  const isInputEmpty = () => {        
    if ((newSubject.subject.trim().length === 0)
        || (newSubject.description.trim().length === 0))
    {
      return true;
    }    
    return false;
  }

  // This function checks if either input field value is too long/large 
  const isInputTooLong = () => {
    const maxSubLength = 100;     // max subject length in characters
    const maxDescLength = 250;    // max description length in characters

    if (newSubject.subject.trim().length > maxSubLength
      || newSubject.description.trim().length > maxDescLength)
    {
      return true;
    }
    return false;
  }

  return (
    <div>
      <div className="w5a_inputGroup">
        <label htmlFor="subjectField">
          Subject
        </label>
        <input 
          type="text" 
          name="subject" 
          id="subjectField"
          value={newSubject.subject}
          onChange={(e) => onChange(e)} 
        />
      </div>
      <div className="w5a_inputGroup">
        <label htmlFor="descriptionField">
          Subject Description
        </label>
        <input 
          type="text" 
          name="description" 
          id="descriptionField" 
          value={newSubject.description}
          onChange={(e) => onChange(e)}
        />
      </div>      
      <div className="w5a_addSubjectButton">
        <Button onClick={onAddButtonClick} block>
          Add New Subject
        </Button>
      </div>
    </div>
  )
}

export default SubjectInput;
