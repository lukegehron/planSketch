import React, { useState } from 'react';
import './signUpPage.css';
import { Redirect, Link } from "react-router-dom";
import { BASE_URL } from '../../constants';

const SignUpPage = ({ isLoggedIn, setIsLoggedIn }) => {

    // setting up our hooks for manipulating form values
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleOnSubmit = (e) => {
        // preventing from our default form submission, because we will let React handle this
        e.preventDefault()
        const userData = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        }

        if (firstName === "" || lastName === "" || email === "" || password === "" || confirmPassword === "") {
            setErrorMessage("Please fill out all fields in the form!");
            return;
        }


        fetch(`${BASE_URL}users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        }).then((response) => response.json()).then(data => {
            const token = data.token;
            localStorage.setItem("token", 'JWT ' + token);
            if (data.success) {
                setIsLoggedIn(true)
            }
        })
    }



    return (
        isLoggedIn ? (<Redirect
            to={{
                path: "/",
            }}
        />) : (<div className="wrapper">
            <div className="signUpFormWrapper">
                <h4>Create Your Account</h4>
                <form className="signUpForm">
                    <label >First name</label><br />
                    <input type="text" id="firstName" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} /><br />
                    <label >Last Name</label><br />
                    <input type="text" id="lastName" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} /><br />
                    <label >Email</label><br />
                    <input type="text" id="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
                    <label>Password</label><br />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
                    <label>Confirm Password</label><br />
                    <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /><br /><br />
                    <button id="signUpButton" className="button" onClick={handleOnSubmit}>Submit</button>
                </form>
                <div className="signInText">Already have an account? Sign in <Link to="/landing">here!</Link></div>
                {errorMessage ? <div className="errorMessage">{errorMessage}</div> : null}
            </div>
        </div>)
    )
}

export default SignUpPage;