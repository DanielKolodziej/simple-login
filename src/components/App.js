import React from 'react';
import Header from './Header';

import { UserProvider } from './UserContext';

const App = () => {
  return (
    <UserProvider>
      <Header />
    </UserProvider>
  )
};

export default App;
