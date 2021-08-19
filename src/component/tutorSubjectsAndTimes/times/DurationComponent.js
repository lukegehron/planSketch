import {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';

/*
  Name: DurationComponent
  Author: Colum Murphy

  This component allows the user to select a time duration,
  either 15, 30, 45 or 60 minutes using radio buttons.
  
  The selected duration is passed up to the parent component 
  using the changeDuration prop.
*/

const DurationComponent = (props) => {

  const { changeDuration } = props;

  // set 30 minutes as the default available time 
  const [timeSlotDuration, setTimeSlotDuration] = useState(30);
  
  useEffect(() => {
    changeDuration(timeSlotDuration);
  // eslint-disable-next-line
  }, [timeSlotDuration]);

  return (
    <div>
      <div>Select Duration</div>
      <Form>
        <div>
          <Form.Check 
            inline label="15 min " name="duration-group1" 
            type="radio" id="duration-inline-radio-1" value="15"
            checked={timeSlotDuration === 15}
            onChange={() => setTimeSlotDuration(15)}
          />
          <Form.Check 
            inline label="30 min " name="duration-group1" 
            type="radio" id="duration-inline-radio-2" value="30"
            checked={timeSlotDuration === 30}
            onChange={() => setTimeSlotDuration(30)}
          />
          <Form.Check 
            inline label="45 min " name="duration-group1" 
            type="radio" id="duration-inline-radio-3" value="45"
            checked={timeSlotDuration === 45}
            onChange={() => setTimeSlotDuration(45)}
          />
          <Form.Check 
            inline label="60 min" name="duration-group1" 
            type="radio" id="duration-inline-radio-4" value="60"
            checked={timeSlotDuration === 60}
            onChange={() => setTimeSlotDuration(60)} 
          />
        </div>
      </Form>
    </div>
  )
}

export default DurationComponent;
