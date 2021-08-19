import { BsXCircleFill } from 'react-icons/bs';
import '../tutorSubjectsAndTimes.css';

/*
  Name: SubjectItem
  Author: Colum Murphy

  This component represents an individual subject in the list 
  of tutor subjects.  It passes delete requests to the parent component.
*/

const SubjectItem = (props) => {  
  const { deleteSubject } = props;
  const { id, subject, description } = props.tutorSubject;

  return (
    <div className='w5a_subjectItemContainer'>
      <div className='w5a_subjectTitle'>
        <div className='w5a_subjectTitleText'>
          {subject}
        </div>
        <BsXCircleFill
          id='deleteSubjectIcon'
          style={w5a_deleteSubjectIcon}
          onClick={() => deleteSubject(id)}
        />
      </div>
      <div>{description}</div>
    </div>
  )
}

const w5a_deleteSubjectIcon = {
  color: '#FF0000', 
  cursor: 'pointer',
  flex: '0 0 1rem'
}

export default SubjectItem;
