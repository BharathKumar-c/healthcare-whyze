import React from 'react';
import { RoutesUrls } from './constant/RoutesUrls';
import Dashboard from './pages/Dashboard';
import NewFeasibilityStudy from './pages/NewFeasibilityStudy/index.js';
import NotFoundPage from './pages/NotFoundpage';
import ProfilePage from './pages/ProfilePage';
import CreateAccount from './pages/UserAccounts/CreateAccount';
import ForgotPassword from './pages/UserAccounts/ForgotPassword';
import SetupPassword from './pages/UserAccounts/SetupPassword';
import SignIn from './pages/UserAccounts/SignIn';
import ForgotPasswordEmail from './pages/UserAccounts/ForgotPassowrdEmail';
import FeasibilityStudiesInPlanning from './pages/Dashboard/AllFeasibilityStudies';

const routes = () => {
  const privateRoutes = [
    {
      path: RoutesUrls.dashBoardUrl,
      Component: <Dashboard />,
    },
    {
      path: RoutesUrls.newFeasibilityStudyUrl,
      Component: <NewFeasibilityStudy />,
    },
    {
      path: RoutesUrls.notFoundUrl,
      Component: <NotFoundPage />,
    },
    {
      path: RoutesUrls.profileUrl,
      Component: <ProfilePage />,
    },
    {
      path: RoutesUrls.feasibilityStudiesInPlanning,
      Component: <FeasibilityStudiesInPlanning />,
    },
  ];
  const publicRoutes = [
    {
      path: RoutesUrls.loginUrl,
      Component: <SignIn />,
    },
    {
      path: RoutesUrls.createAccountUrl,
      Component: <CreateAccount />,
    },
    {
      path: RoutesUrls.setupPasswordUrl,
      Component: <SetupPassword />,
    },
    {
      path: RoutesUrls.forgotPasswordEmailUrl,
      Component: <ForgotPasswordEmail />,
    },
  ];
  const passwordRoutes = [
    {
      path: RoutesUrls.forgotPasswordUrl,
      Component: <ForgotPassword />,
    },
  ];
  return {
    privateRoutes,
    publicRoutes,
    passwordRoutes,
  };
};

export default routes;
