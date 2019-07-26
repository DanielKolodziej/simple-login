import React, { useState } from 'react';

//create context for the current user (empty obj as default for no user logged in)
// const UserContext = React.createContext({
//     name: '',
//     loggedIn: false
// });

//create context with two values (empty object, empty function)
// const UserContext = React.createContext({}, () => {});
const UserContext = React.createContext({});

const UserProvider = (props) => {
    const [status, setStatus] = useState({});

    return (
        <UserContext.Provider value={[status, setStatus]}>
            {props.children}
        </UserContext.Provider>
    );
}

//component that provides the value
// export const UserProvider = UserContext.Provider;


export { UserContext, UserProvider};