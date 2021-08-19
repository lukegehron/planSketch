import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container, Button, Modal, Alert } from 'react-bootstrap';
import DateComponent from '../tutorSubjectsAndTimes/times/DateComponent';
import AvailableTimeList from './AvailableTimeList';
import getTutorAvailability from './actions/getTutorAvailability';
import postScheduledMeeting from './actions/postScheduledMeeting';
import './modalWindow.css';


/*
  Name: ModalWindow
  Author: Colum Murphy

  This component allows the user to select a date, and a time slot/period
  to schedule a meeting.

  Props: modalShow, studentId, tutorId, subjectTitle, 
         subjectDescription, tutorName
  These props have values assigned in the parent component.  
  
  Props: hideModal
  This prop causes the modal window to close.   
*/

const ModalWindow = (props) => {

  const { modalShow, hideModal, studentId, tutorId, subjectTitle,
    subjectDescription, tutorName } = props;

  // the tutor availability
  const [tutorAvailability, setTutorAvailability] = useState([]);

  // all the tutor available dates, for calendar highlighting
  const [allAvailDates, setAllAvailDates] = useState([]);

  // the date selected by the user, from the calendar component
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  // the selected date converted to a string, used for a useEffect hook
  const selectedDateString = selectedDate.toISOString();

  // all the time slots available, for the selected date
  const [timeSlotsForDate, setTimeSlotsForDate] = useState([]);

  // the time slot selected by the user, for a particular date
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // state used by the Alert component to show messages
  const [showAlert, setShowAlert] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    const getAvailability = async () => {
      // get tutor availability data
      const result = await getTutorAvailability(tutorId);
      const { error, msg, data, status } = result;

      // if there is an error, show a message and send to console
      if (error) {
        showMessage('Error Connecting to Server!', 'danger');
        handleError({ status: status, msg: msg });
        return;
      }
      // convert response data, change date string to date object    
      convertData(data.data);
    }

    // when the tutorId gets updated, get the tutor availability data
    if (tutorId !== '') {
      getAvailability();
    }
    // eslint-disable-next-line
  }, [tutorId]);


  // update, when the tutor availability, or the date selected in calendar changes
  useEffect(() => {

    // filter the tutor availability for time slots that match
    // the date selected in the calendar
    const matchingTimeSlots = tutorAvailability.filter(item =>
      (equalDates(item.startDateTime, selectedDate)));

    setTimeSlotsForDate(matchingTimeSlots);
    // eslint-disable-next-line
  }, [selectedDateString, tutorAvailability]);


  // update the available dates state (highlight dates)
  // when the the tutor availability changes
  useEffect(() => {
    // map the tutor availability to a dates only array
    const datesArray = tutorAvailability.map(item => {
      return item.startDateTime;
    });
    setAllAvailDates(datesArray);
  }, [tutorAvailability]);


  // Convert the time string in each object to a date object.
  // Filter out any time slots that have a start time before the current time. 
  const convertData = (timeStringArray) => {

    const dateObjectArray = timeStringArray.map(item => {
      return {
        id: item._id,
        startDateTime: new Date(item.timeslotStart),
        endDateTime: new Date(item.timeslotEnd)
      }
    });

    // filter array for start times in the future
    const dateTimeNow = new Date();
    const futureTimeAndDate = dateObjectArray.filter(item =>
      item.startDateTime > dateTimeNow);

    // sort by date + time  
    futureTimeAndDate.sort((a, b) => {
      return a.startDateTime.getTime() - b.startDateTime.getTime()
    });

    // set tutor availability
    setTutorAvailability(futureTimeAndDate);
  }


  // Function returns true if year, month and date match for 2 date objects
  const equalDates = (dateA, dateB) => {
    if (dateA.getFullYear() === dateB.getFullYear()
      && dateA.getMonth() === dateB.getMonth()
      && dateA.getDate() === dateB.getDate()) {
      return true;
    }
    return false;
  }


  // Function POSTS a scheduled meeting object to the server
  const scheduleMeeting = async () => {

    // if the student has not selected a date and time
    if (selectedTimeSlot === null) {
      // display an information message and return
      showMessage('Please select a date and time!', 'info');
      return;
    }

    // create a meeting object
    const meeting = {
      title: subjectTitle,
      description: subjectDescription,
      startTime: selectedTimeSlot.startDateTime.toISOString(),
      endTime: selectedTimeSlot.endDateTime.toISOString(),
      organizer: studentId,
      participant: tutorId,
      availabilityId: selectedTimeSlot.id
    }

    // post the meeting object to the server
    const resultOfPost = await postScheduledMeeting(meeting);

    // if there is an error, show a message and pass error to App level   
    if (resultOfPost.error) {
      showMessage('Error Connecting to Server!', 'danger');
      handleError({ status: resultOfPost.status, msg: resultOfPost.msg });
      return;
    }

    // remove the time slot from the tutor available time slots
    const remainingTimeSlots = tutorAvailability.filter(timeSlot =>
      timeSlot.id !== selectedTimeSlot.id);
    setTutorAvailability(remainingTimeSlots);

    // show a success message to the user
    showMessage('Meeting Scheduled!', 'success');
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


  // send the error to the console
  const handleError = (errorObj) => {
    if (errorObj.status) {
      console.log(`Status: ${errorObj.status}`);
    }
    if (errorObj.msg) {
      console.log(`Message: ${errorObj.msg}`);
    }
  }


  return (
    <>
      <Modal
        contentClassName="w5_modalWindow"
        show={modalShow}
        onHide={hideModal}
        animation={false}
        centered
      >

        <Modal.Header closeButton>
          <Container>
            <Row>
              <Col>
                <div className="w5_modalTitle">
                  Check Availability
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                {subjectTitle}
              </Col>
            </Row>
            <Row>
              <Col>
                {tutorName}
              </Col>
            </Row>
          </Container>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} sm={7}>
                <div className="w5_columnTitle">Available Dates</div>
                <div className="w5_dateComponent">
                  <DateComponent
                    changeSelectedDate={(date) => setSelectedDate(date)}
                    datesToHighlight={allAvailDates}
                  />
                </div>
              </Col>
              <Col xs={12} sm={5}>
                <div>
                  <div className="w5_columnTitle">
                    Available Times
                  </div>
                  <AvailableTimeList
                    timeSlotsForDate={timeSlotsForDate}
                    changeSelectedTimeSlot={
                      (timeSlot) => setSelectedTimeSlot(timeSlot)
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row>
              <Col>
                <Alert transition={false} show={showAlert} variant={messageType}>
                  {messageText}
                </Alert>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="w5_modalButtons">
                  <div>
                    <Button variant="secondary" onClick={hideModal}>
                      Close
                    </Button>
                  </div>
                  <div className="w5_modalScheduleButton">
                    <Button variant="primary" onClick={scheduleMeeting}>
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>

      </Modal>
    </>
  )
}

ModalWindow.propTypes = {
  modalShow: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  studentId: PropTypes.string.isRequired,
  tutorId: PropTypes.string.isRequired,
  subjectTitle: PropTypes.string.isRequired,
  subjectDescription: PropTypes.string.isRequired,
  tutorName: PropTypes.string.isRequired
}

export default ModalWindow;
