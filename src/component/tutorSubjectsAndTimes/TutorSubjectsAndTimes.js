import ManageTutorSubjects from './subjects/ManageTutorSubjects';
import ManageTutorTimes from './times/ManageTutorTimes';
import { Container, Row, Col } from 'react-bootstrap';

/*
  Name: TutorSubjectsAndTimes
  Author: Colum Murphy

  This component combines the L.H.S. and R.H.S. of wireframe 5a
  using a Bootstrap container.  
*/

const TutorSubjectsAndTimes = () => {

  return (
    <div className='w5a_pageContainer'> 
      <Container fluid>
        <Row className="justify-content-sm-center">
          <Col sm={12} md={5} lg={5}>
            <ManageTutorSubjects />
          </Col>
          <Col sm={12} md={{ span:6, offset:1 }} lg={{ span:5, offset:1 }}>
            <ManageTutorTimes />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TutorSubjectsAndTimes;