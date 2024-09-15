import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
const PublicRoutes = ({ isLoggedIn }) => {
  return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" />;
};
PublicRoutes.propTypes = {
  isLoggedIn: PropTypes.bool,
};

PublicRoutes.defaultProps = {
  isLoggedIn: false,
};
export default PublicRoutes;
