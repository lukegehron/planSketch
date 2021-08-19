import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import { Button, ButtonGroup, Container, ListGroup, Row, Col, Figure, Form } from 'react-bootstrap';
import './userProfile.css';
import Meeting from '../Meeting/meeting';
import SearchPage from '../SearchPage/SearchPage';
import TutorSubjectsAndTimes from '../tutorSubjectsAndTimes/TutorSubjectsAndTimes';

const UserProfile = () => {

  const [subjects, setSubjects] = useState([]);


  useEffect(() => {
      fetch(`https://fast-stream-40869.herokuapp.com/subjects/list/${localStorage.token}`).then((response) => response.json()).then(response => {
      setSubjects(response.data.subjects);

      })
  }, []);

    return <div className="container">

    <Container>

    <Row>
        <h1><b>User Profile</b></h1>
    </Row>

<br></br>

    <Row>
      <Col>
        <Figure>
          <Figure.Image
          width={171}
          height={180}
          alt="171x180"
          src="http://placekitten.com/200/200"
          />
        </Figure>
      </Col>

     <Col>
        <a href="#" className="btn btn-primary">Edit Photo</a>
        &nbsp;&nbsp;&nbsp;
        <a href="#" className="btn btn-danger">Delete Photo</a>
     </Col>
    </Row>

    <Row>
      <Col>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
          We'll never share your email with anyone else.
          </Form.Text>
          </Form.Group>
        </Form>
      </Col>

      <Col>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Change" />
          </Form.Group>
          <Button variant="primary" type="submit">
          Submit
          </Button>
        </Form>
      </Col>
    </Row>

<br></br>

    <Row>
   
      <Col>
      <h4><b>Active Subjects</b></h4>
      <ListGroup>
        {subjects.map(subject => {
          return (<ListGroup.Item>{subject.subject} -- {subject.description}</ListGroup.Item>)
        })}
        </ListGroup>
      </Col>

    </Row>

<br></br>

<Row>
  
  <Link to="../">
   <a href="#" className="btn btn-primary">Search for Subjects</a>
   </Link>
        &nbsp;&nbsp;&nbsp;
   <Link to="../tutor">
   <a href="#" className="btn btn-primary">Add Subjects + Availability</a>
   </Link>
        &nbsp;&nbsp;&nbsp;
   <Link to="../ManageMeetings">
   <a href="#" className="btn btn-primary">Manage Meetings</a>
   </Link>

 </Row>

<br></br>

    </Container>

    </div>
}

export default UserProfile