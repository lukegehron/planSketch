import React from 'react';
import SubjectInput from '../SubjectInput';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import each from "jest-each";

/*
  Name: SubjectInput Test
  Author: Colum Murphy

  This code tests the SubjectInput component with different inputs  
  by mocking the components props.
  If the input is valid the addNewSubject function should be called.
  If the input is invalid the handleInputError function should be called. 
*/

// set up enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });

let mockAddNewSubject = jest.fn();
let mockHandleInputError = jest.fn();
let wrapper;

const setup = () => {
  return mount(
    <SubjectInput 
      addNewSubject={mockAddNewSubject}
      handleInputError={mockHandleInputError}
    />);
}

// Check that the following inputs are rejected by the SubjectInput component
describe("Input handled by handleInputError function", () => {
  each([
    ['', ''],
    [' ', ' '],
    ['', 'a'],
    ['a', ''],
    [ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',    // 101 chars
      'a'
    ],
    [ 'a',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaa'                                   // 251 chars
    ]
  ]).test("subject is '%s', description is '%s'", (subjectField, descriptionField) => {
    
    // clear existing values
    mockAddNewSubject.mockClear();
    mockHandleInputError.mockClear();

    // replace react useState with mock
    React.useState = jest.fn( () => 
      [{
        subject: subjectField,
        description: descriptionField,
      }, jest.fn()] );
  
    wrapper = setup();
  
    // click the add button
    const addButton = wrapper.find('button');
    addButton.simulate('click');
  
    // expect the error function to be called
    expect(mockHandleInputError).toHaveBeenCalled();
  });
});


// Check that the following inputs are accepted by the SubjectInput component
describe("Input handled by addNewSubject function", () => {
  each([
    ['a', 'a'],
    ['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', // 100 chars
      'a'
    ],
    [ 'a',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    + 'aaaaaaaaaa'                                  // 250 chars
    ]
  ]).test("subject is '%s', description is '%s'", (subjectField, descriptionField) => {

    // clear existing values
    mockAddNewSubject.mockClear();
    mockHandleInputError.mockClear();

    // replace react useState with mock
    React.useState = jest.fn( () => 
      [{
        subject: subjectField,
        description: descriptionField,
      }, jest.fn()] );
  
    wrapper = setup();
  
    // click the add button
    const addButton = wrapper.find('button');
    addButton.simulate('click');
  
    // expect the add new subject function to be called
    expect(mockAddNewSubject).toHaveBeenCalled();
  });
});
