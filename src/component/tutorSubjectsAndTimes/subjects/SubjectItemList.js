import SubjectItem from './SubjectItem';
import '../tutorSubjectsAndTimes.css';

/*
  Name: SubjectItemList
  Author: Colum Murphy

  This component lists each of the tutors subjects (tutorSubjects).
  It passes any delete subject requests (deleteSubject) to the parent component.  
  It has one child component, SubjectItem.
*/

const SubjectItemList = (props) => {
  
  const { tutorSubjects, deleteSubject } = props;

  return (        
    <div className='w5a_subjectListContainer'>
      {tutorSubjects.map( tutorSubject => {
        return (
          <SubjectItem 
            key={tutorSubject.id}
            tutorSubject={tutorSubject}            
            deleteSubject={deleteSubject}
          />
        )
      })} 
    </div> 
  )
}

export default SubjectItemList;
