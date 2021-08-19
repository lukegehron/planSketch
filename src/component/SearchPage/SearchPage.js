import React, { useState } from "react";
import "./SearchPage.css";
import { BASE_URL } from '../../constants';
import ModalWindow from '../scheduleMeetingModal/ModalWindow'
import { Container, Row, Col } from 'react-bootstrap';

const SearchPage = () => {

    const [subjectInput, setSubjectInput] = useState('')
    const [tutors, setTutors] = useState([])
    const [showModal, setShowModal] = useState(false)
    // setting the current parameters to send to the schedule meeting window
    const [currentSubjectDescription, setCurrentSubjectDescription] = useState('')
    const [currentTutorId, setCurrentTutorId] = useState('')
    const [currentSubjectTitle, setCurrentSubjectTitle] = useState('')
    const [currentTutorName, setCurrentTutorName] = useState('')

    // custom logic passed down to close modal
    const hideModal = () => {
        setShowModal(false)
    }

    const handleSearchSubmit = () => {
        fetch(`${BASE_URL}subjects/list?id=${localStorage.token}&subject=${subjectInput}`).then((response) => response.json()).then(response => {
            console.log(response.data.subjects)
            setTutors(response.data.subjects);
        })
    }

    return <div className="container">
        <Container fluid>

            <Row>
                <h1><b>Search for Tutors</b></h1>
            </Row>

            <br></br>

            <Row>

                <Col sm={12} md={5} lg={5}>

                    <div className="showbox">
                        {tutors.map(tutor => {
                            return (

                                <Row>
                                    <Col>
                                        <div className="tutorbox">
                                            <div key={tutor._id}>
                                                {tutor.subject}<br />
                                                {tutor.description}<br />
                                                {`${tutor.user.firstName} ${tutor.user.lastName}`}<br />
                                                <a className="availabilty" onClick={() => {
                                                    setShowModal(true)
                                                    setCurrentSubjectDescription(tutor.description)
                                                    setCurrentTutorId(tutor.user._id)
                                                    setCurrentSubjectTitle(tutor.subject)
                                                    setCurrentTutorName(`${tutor.user.firstName} ${tutor.user.lastName}`)
                                                }}>Check Availability</a>
                                            </div>
                                        </div>
                                        <br />
                                    </Col>
                                </Row>

                            )

                        })}

                    </div>
                </Col>

                {<ModalWindow
                    modalShow={showModal}
                    hideModal={hideModal}
                    subjectDescription={currentSubjectDescription}
                    tutorId={currentTutorId}
                    subjectTitle={currentSubjectTitle}
                    tutorName={currentTutorName}
                    studentId={localStorage.token}
                />}

                <Col sm={12} md={5} lg={5}>
                    <div className="search">
                        <h5>
                            <label htmlFor="subject-search"><b>Search for Subject</b></label>
                        </h5>
                        <input type="text" id="subject" name="subject" value={subjectInput} onChange={e => setSubjectInput(e.target.value)} aria-label="Search through site content"></input>
                        <button onClick={handleSearchSubmit}>Search For Tutors</button>
                    </div>
                </Col>
            </Row>

        </Container>

    </div>
}

export default SearchPage;