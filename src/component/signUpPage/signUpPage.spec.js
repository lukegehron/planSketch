import React from 'react';
import { shallow, mount } from 'enzyme';
import SignUpPage from './signUpPage';
import { BrowserRouter } from 'react-router-dom';



describe('<SignUpPage/>', () => {
    it('should show an error message if all the fields are not filled in', () => {
        const wrapper = mount(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>);

        const component = wrapper.find(".signUpFormWrapper");
        expect(component.exists()).toBe(true);

        // try to find error message - should not exist since button has not been clicked
        let errorMessage = wrapper.find("#errorMessage");
        expect(errorMessage.exists()).toBe(false);

        // find submit button and simulate a click. this will cause an error message to show up
        // since none of our fields have been filled in
        const submitButton = wrapper.find("#signUpButton");
        submitButton.simulate('click');

        // now when we try to find the error message, it shows, since we tried to submit with no date!
        errorMessage = wrapper.find("#errorMessage");
        expect(errorMessage.exists()).toBe(true);

        // unmount the wrapper. if we don't unmount, this can possibly interfere with any tests following in this file
        wrapper.unmount();
    });
    it('should not render if the user is logged in', () => {
        const wrapper = mount(
            <BrowserRouter>
                <SignUpPage isLoggedIn />
            </BrowserRouter>);

        const component = wrapper.find(".signUpFormWrapper");
        expect(component.exists()).toBe(false);

        // unmount the wrapper. if we don't unmount, this can possibly interfere with any tests following in this file
        wrapper.unmount();
    });
});