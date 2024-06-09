
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import GroupMain from './components/Groups/GroupMain';
import EventMain from './components/Events/EventMain';
import GroupDetail from './components/GroupDetails/GroupDetail';
import EventDetail from './components/EventDetails/EventDetail';
import * as sessionActions from './store/session';

import LandingPage from './components/Landing/LandingPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/groups',
        element: <GroupMain />
      },
      {
        path: `/groups/:groupId`,
        element: <GroupDetail />
      },
      {
        path: '/events',
        element: <EventMain />
      },
      {
        path: '/events/:eventId',
        element: <EventDetail />
      },
      {
        path: '*',
        element: <h1>404 go back bucko</h1>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
