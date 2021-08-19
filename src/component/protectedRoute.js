/**
 * This component is a reusable, authenticated route. By using this, we will block any other routes until the user is signed in
 */

import {
    Route,
    Redirect
} from "react-router-dom";

const ProtectedRoute = ({
    component: Component,
    isLoggedIn,
    setIsLoggedIn,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (!isLoggedIn) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/signUp",
                                state: { flashInfo: "Please log in to continue." }
                            }}
                        />
                    );
                } else {
                    return <Component {...props} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
                }
            }}
        />
    );
};

export default ProtectedRoute;