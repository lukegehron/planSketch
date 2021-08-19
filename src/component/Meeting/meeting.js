import React from 'react';
import { useState, useEffect, Text } from "react";
import './meeting.css';
import Sketch from 'react-p5'
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { bindProxyAndYMap } from "valtio-yjs";
import { proxy, useSnapshot } from "valtio";
import { Button, ButtonGroup, Container, Row, Col, ToggleButton } from 'react-bootstrap';





let count = 0;
let globalString = ""
let globalSize = 1;
// let meetingID;
let theName = "username"

console.log(window.location)

let params = (new URL(document.location)).searchParams;
let meetingID1 = params.get('id'); // is the string "Jonathan Smith".
// console.log(meetingID)

let meetingID;
let started = false


let ydoc = new Y.Doc();

let websocketProvider = new WebsocketProvider(
  "wss://demos.yjs.dev",
  "tutorsync-" + meetingID1,
  ydoc
);

let ymap = ydoc.getMap("messages.v1");
let mesgMap = proxy({});

let ydocp5 = new Y.Doc();

let websocketProviderp5 = new WebsocketProvider(
  "wss://demos.yjs.dev",
  "tutorsync-" + meetingID1 + "-p5",
  ydocp5
);

let ymapp5 = ydocp5.getMap("messages.v1");
let mesgMapp5 = proxy({});

const Meeting = (data) => {
  // const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  // console.log(radioValue)

  const radios = [
    { name: 'Pencil', value: '1' },
    { name: 'Small', value: '2' },
    { name: 'Large', value: '3' },
  ];

  // console.log(data.dataFromParent)


  // let meetings;
  let myMeeting;


  const [pastMeetings, setPastMeetings] = useState([]);
  const [myName, setMyName] = useState();
  const [myTitle, setMyTitle] = useState();
  const [myDesc, setMyDesc] = useState();
  const [theirName, setTheirName] = useState();
  const [upcomingMeetings, setUpcomingMeetings] = useState([]); // TODO - implement upcoming meetings

  let myID;
  useEffect(() => {
    fetch(`https://fast-stream-40869.herokuapp.com/meetings/list?id=${localStorage.token}`).then((response) => response.json()).then(response => {
      setPastMeetings(response.data.pastMeetings);
      setUpcomingMeetings(response.data.upcomingMeetings); // TODO - implement upcoming meetings

      // console.log(upcomingMeetings)
    })


  }, []);

  let clearScreen = false;
  let saveSnap = false;


  setTimeout(function () {

    const query = new URLSearchParams(document.location.search);
    const token = query.get('id')
    meetingID = token

    if(meetingID1 != meetingID){
      meetingID1 = meetingID;
      clearScreen = true;

      ydoc = new Y.Doc();

websocketProvider = new WebsocketProvider(
  "wss://demos.yjs.dev",
  "tutorsync-" + meetingID,
  ydoc
);

ymap = ydoc.getMap("messages.v1");
mesgMap = proxy({});

ydocp5 = new Y.Doc();

websocketProviderp5 = new WebsocketProvider(
  "wss://demos.yjs.dev",
  "tutorsync-" + meetingID + "-p5",
  ydocp5
);

ymapp5 = ydocp5.getMap("messages.v1");
mesgMapp5 = proxy({});
    }

    for (let i = 0; i < pastMeetings.length; i++) {
      if (pastMeetings[i].meeting._id == meetingID) {
        // console.log("got it past")
        myMeeting = pastMeetings[i]
      }
    }
    // console.log(upcomingMeetings)

    for (let i = 0; i < upcomingMeetings.length; i++) {
      // console.log(upcomingMeetings[i].meeting._id, meetingID)

      if (upcomingMeetings[i].meeting._id == meetingID) {
        // console.log("got it upcoming")
        myMeeting = upcomingMeetings[i]
      }
    }

    // console.log(myMeeting)
    // console.log(localStorage.token)

    fetch(`https://fast-stream-40869.herokuapp.com/availabilites/list?id=${localStorage.token}`).then((response) => response.json()).then(response => {
      // console.log("----------")
      // console.log(response.data);
      if (myMeeting != undefined) {
        setMyTitle(myMeeting.meeting.title)
        setMyDesc(myMeeting.meeting.description)
        if (response.data.length > 0) {
          myID = response.data[0].user._id
          setMyName(response.data[0].user.firstName)
        } else {
          myID = myMeeting.organizer._id
          setMyName(myMeeting.organizer.firstName)
        }
        theName = myName
        if (myID == myMeeting.organizer._id) {
          setTheirName(myMeeting.participant.firstName)
        } else {
          setTheirName(myMeeting.organizer.firstName)
        }
      }
      // console.log("----------")
      // console.log(myName)
      
    })
    bindProxyAndYMap(mesgMap, ymap);
  bindProxyAndYMap(mesgMapp5, ymapp5);
  started = true;


  }, 2000);



  // console.log(name)

  //   useEffect(() => {

  // }, []);
  //availabilites/list?id=<JWT token in local storage>



  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(800, 300).parent(canvasParentRef)
    p5.strokeWeight(2)
    p5.stroke(237, 34, 93);

  }

  let [message, setMessage] = useState("");
  const draw = p5 => {
    // p5.background(255,255,255)
    if(clearScreen){
      p5.background(255,255,255)
      clearScreen = false;
      console.log("cleared")
    }
    
    if (p5.mouseIsPressed) {
      if(saveSnap && started){
        console.log("snapped")
        saveSnap = false
        p5.saveCanvas();
      }
      count += 1
      var d = new Date();
      var n = d.toLocaleTimeString('en-US');
      let name;
      if (myName) {
        name = myName
      } else {
        name = "username"
      }


      const send = () => {
        if (name && message) {
          mesgMapp5[name + "_" + n + ", " + count] = message;
        }
      };
      if (p5.mouseX > 0 && p5.mouseX < 800 && p5.mouseY > 0 && p5.mouseY < 300) {
        setMessage("" + p5.mouseX + ", " + p5.mouseY + ", " + p5.pmouseX + ", " + p5.pmouseY + ", " + radioValue)
        send()
      }
      p5.strokeWeight(radioValue)
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    }
    const snapp5 = globalString
    let myText = []
    Object.keys(snapp5)
      .reverse()
      .map((key) => (
        myText.push([snapp5[key].split(",")])

      ))
    // console.log(myText.length)
    for (let i = 0; i < myText.length; i++) {
      let myPts = myText[i]
      // console.log(myPts)
      p5.strokeWeight(myPts[0][4])
      p5.line(myPts[0][0], myPts[0][1], myPts[0][2], myPts[0][3]);

    }
  }

  

  function onSizeChange(size) {
    globalSize = size
    console.log(size)
  }

  function clear(){
    clearScreen = true;
  }

  function saveS(){
    if(started){
      saveSnap = true;
    }
    
  }


  return <div className="container">
    <Container>
    {/* {(() => {
              if (myMeeting != undefined){
                  return (
                      <Text><h4>Title: {myMeeting.meeting.title}</h4>
                      <h4>Description: {myMeeting.meeting.description}</h4></Text>
                  )
              }
              
              return null;
            })()} */}
      <h4>Title: {myTitle}</h4>
      <h4>Description: {myDesc}</h4>
      {/* <h4>Other Username: {theirName}</h4>
      <h4>MeetingID: {meetingID}</h4> */}
      {/* <h2>My Message</h2>
    <MyMessage />
    <h2>Messages</h2>
    <Messages /> */}

      <Row>
        <Col md={{ span: 11, offset: 0 }}>&nbsp;</Col>
        <Col md={{ span: 5, offset: 2 }} block>
          <ButtonGroup>
            <Button variant="outline-dark" md={{ span: 6, offset: 0 }} block>Members: {myName} and {theirName}</Button>
            <Button variant="outline-dark" md={{ span: 3, offset: 0 }}>Started: 2pm</Button>
            <Button variant="outline-dark" md={{ span: 3, offset: 0 }}>Ending: 3pm</Button>
          </ButtonGroup>
        </Col>
        <Col md={{ span: 3, offset: 2 }}>
          <Button block size="lg" variant="danger">End Meeting</Button>
        </Col>

        <Col md={{ span: 11, offset: 0 }}>&nbsp;</Col>

        <Col md={{ span: 3, offset: 2 }}>

          <Button href="#" block>White Board</Button>
        </Col>
        <Col md={{ span: 3, offset: 0 }}>
          <Button variant="secondary" href="#" block>Media Viewer</Button>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <ButtonGroup vertical size="lg" style={{ width: "150px", marginTop: "75px" }}>
            {radios.map((radio, idx) => (
              <ToggleButton style={{ margin: "0px" }}
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant='outline-dark'
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Col>
        <Col md={{ span: 10, offset: 0 }}>
          <div className='p5'>
            <Sketch setup={setup} draw={draw} />
            {/* <div id="app"></div> */}
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 11, offset: 0 }}>&nbsp;</Col>
        <Col md={{ span: 3, offset: 2 }}>
          <Button variant="secondary" href="#" block>Chat</Button>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <ButtonGroup vertical size="lg" style={{ width: "150px", marginTop: "75px" }}>
            <Button variant="dark" onClick={clear()} >Clear Screen</Button>
            <Button variant="outline-dark" onClick={saveS()}>Save file</Button>
            <Button variant="outline-dark" >Upload file</Button>
          </ButtonGroup>
        </Col>
        <Col md={{ span: 10, offset: 0 }}>
          <div className='p5'>
            <div className="chat-popup" id="myForm">
              {/* <form action="/action_page.php" className="form-container"> */}

              {/* <textarea placeholder="Type message.." name="msg" required></textarea> */}
              <Messages msg={mesgMap}/>

              <MyMessage msg={mesgMap}/>
              <Messagesp5 msg={mesgMapp5}/>

              {/* <button type="submit" className="btn">Send</button> */}
              {/* </form> */}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
}

const MyMessage = (msgMap) => {
  // const [name, setName] = useState("");
  var d = new Date();
  var n = d.toLocaleTimeString('en-US');
  let name = theName;
  const [message, setMessage] = useState("");
  const send = () => {
    if (name && message) {
      msgMap.msg[name + "_" + n] = message;
    }
  };
  const handleKeyDown = (event) => {
    // console.log(event.key)
    if (event.key === 'Enter') {
      send()
    }
  }
  return (
    <div>
      <div>
        Message:{" "}
        <input value={message} style={{ width: '100%' }} onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)}  />
      </div>
      <button disabled={!name || !message} style={{ width: '100%' }} onClick={send} >
        Send
      </button>
    </div>
  );
};


const Messages = (msgMap) => {
  // console.log(msgMap)
  const snap = useSnapshot(msgMap.msg);
  //  console.log(snap)
  return (
    <div style={{ background: 'lightGrey', padding: "10px", borderRadius: "6px", margin: "14px", maxHeight: "300px", overflowX: "hidden" }}>
      {Object.keys(snap)
        .reverse()
        .map((key) => (
          <p key={key}>
            {key}: {snap[key]}
          </p>
        ))}
    </div>
  );
};

const Messagesp5 = (msgMapp5) => {
  const snapp5 = useSnapshot(msgMapp5.msg);
  globalString = snapp5
  return (
    <div></div>
  );
};


export default Meeting