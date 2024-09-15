import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
const PrivateRoutes = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};
PrivateRoutes.propTypes = {
  isLoggedIn: PropTypes.bool,
};

PrivateRoutes.defaultProps = {
  isLoggedIn: false,
};
export default PrivateRoutes;
