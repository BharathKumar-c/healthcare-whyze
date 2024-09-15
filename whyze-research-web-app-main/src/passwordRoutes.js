// PasswordRoutes
import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

const PasswordRoutes = ({ isDisableForgot }) => {
  if (isDisableForgot && window.location.pathname === '/forgot-password') {
    return <Navigate to="/" />;
  }

  return !isDisableForgot ? (
    <Outlet />
  ) : (
    <Navigate to={window.location.pathname} />
  );
};

PasswordRoutes.propTypes = {
  isDisableForgot: PropTypes.bool,
};

PasswordRoutes.defaultProps = {
  isDisableForgot: false,
};

export default PasswordRoutes;
