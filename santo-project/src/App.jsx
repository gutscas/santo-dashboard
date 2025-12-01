import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  // Initialize theme on app load
  useEffect(() => {
    const theme = store.getState().theme.theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Provider store={store}>
      <UserProvider>
        <BrowserRouter >
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </Provider>
  );
}

export default App;

