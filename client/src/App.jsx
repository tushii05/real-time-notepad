import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Registration';
import AppLayout from './layouts/AppLayOut';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './components/dashboard';
import { Provider } from 'react-redux';
import { store } from './app/store';


const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    )
  },
  {
    path: "/",
    element: <AppLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: "profile",
            element: <ProfilePage />
          }
        ]
      }
    ]
  }
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  );
};

export default App;