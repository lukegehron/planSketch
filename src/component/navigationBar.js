import React from "react"
import {
    Link
} from "react-router-dom";

import Logo from './tutorsynclogo.png';

const NavigationBar = ({ isLoggedIn, setIsLoggedIn }) => {


    const handleSignOut = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
    }

    return isLoggedIn ? (

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Link className="navbar-brand" to="/"> <img src={Logo} alt="" width="200" height="40"/></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/userProfile">User Profile</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/tutor">Manage Tutor Times</Link><span className="sr-only">(current)</span>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/manageMeetings">Manage Meetings</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/meeting">Go To Meeting</Link>
                    </li>
                </ul>
                <form className="form-inline my-2 my-lg-0">
                    <button type="button" onClick={handleSignOut} className="form-control mr-sm-2">Sign Out</button>
                </form>
            </div>
        </nav>
    ) : (<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Link className="navbar-brand" to="/"><img src={Logo} alt="" width="200" height="40"/></Link>
    </nav>)
}

export default NavigationBar;