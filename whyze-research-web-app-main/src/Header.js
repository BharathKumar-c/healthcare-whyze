import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { AppBar } from './components/shared';
import SettingModal from './components/shared/SettingModal';
import { feasibilityStudiesInPlanning } from './constant/ConstantTexts';

const titles = {
  dashboard: '',
  'new-feasibility-study/:id': 'New feasibility study',
  profile: 'Profile',
  'feasibility-studies-in-planning': feasibilityStudiesInPlanning,
};

const Header = ({ path }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <AppBar
        title={titles[path]}
        currentPage={path}
        onOpenSetting={() => setOpenModal(true)}
      />

      <Outlet />
      <SettingModal
        openModal={openModal}
        handleClose={handleClose}
        type="edit"
      />
    </>
  );
};

Header.propTypes = {
  path: PropTypes.string,
};

Header.defaultProps = {
  path: '',
};

export default Header;
