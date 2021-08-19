import './App.css';

//Colum
import TutorSubjectsAndTimes from './component/tutorSubjectsAndTimes/TutorSubjectsAndTimes';

//Luke
import Meeting from './component/Meeting/meeting';

//Rick
import SignUpPage from './component/signUpPage/signUpPage';
import ProtectedRoute from './component/protectedRoute';


import LandingPage from './component/landingPage/landingPage';

//Tuoyang
import ManageMeetings from './component/ManageMeetings/ManageMeetings'
import UserProfile from './component/userProfile/userProfile';

//Yi-Chun
import SearchPage from './component/SearchPage/SearchPage';


import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NavigationBar from './component/navigationBar';
import { useEffect, useState } from 'react'

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  
  return (
    <Router>
      <NavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Switch>

        <ProtectedRoute
          exact
          path="/Meeting"
          component={Meeting}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <ProtectedRoute
          exact
          path="/"
          component={SearchPage}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <ProtectedRoute
          exact
          path="/manageMeetings"
          component={ManageMeetings}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <ProtectedRoute
          exact
          path="/userProfile"
          component={UserProfile}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <ProtectedRoute
          exact
          path="/tutor"
          component={TutorSubjectsAndTimes}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <Route exact path="/landing" render={() => (
          <LandingPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )} />
        <Route exact path="/signUp" render={() => (
          <SignUpPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )} />
      </Switch>
    </Router>
  );
}

export default App;