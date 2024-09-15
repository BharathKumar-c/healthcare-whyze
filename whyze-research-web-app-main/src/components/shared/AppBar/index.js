import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'antd';
import './AppBar.scss';
import TitleComponent from './TitleComponent';
import ProfileComponent from './ProfileComponent';
import { dateFormatter } from '../../../utils/calculations';
import { useNavigate } from 'react-router-dom';
import useSaveandCloseService from '../../../pages/NewFeasibilityStudy/FooterNewFeasibilityStudy/SaveAndClose/useSaveandCloseService';
import { resetSegments } from '../../../redux/reducer/feasibilityStudyReducer';
import { useDispatch } from 'react-redux';
import { clearSettings } from '../../../redux/reducer/projectsReducer';
import useProfileComponentService from './ProfileComponent/useProfileComponentService';

const AppBar = ({ title, currentPage, onOpenSetting }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saveUserProject } = useSaveandCloseService();
  const { getUserDetails } = useProfileComponentService();

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleBack = (page) => {
    if (page === 'new-feasibility-study/:id') {
      saveUserProject();
      dispatch(resetSegments());
      dispatch(clearSettings());
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <PageHeader
        className="site-page-header appbar"
        style={{
          height:
            currentPage === 'dashboard' ||
            currentPage === 'profile' ||
            currentPage === 'feasibility-studies-in-planning'
              ? '80px'
              : '56px',
        }}
        title={
          <TitleComponent
            title={title}
            onBack={handleBack}
            currentPage={currentPage}
          />
        }
        subTitle={
          currentPage === 'new-feasibility-study/:id'
            ? dateFormatter('dd/MM/yyyy')
            : currentPage === 'new-feasibility-study-view'
            ? `Last edited • ${dateFormatter('dd/MM/yyyy')}`
            : ''
        }
        extra={
          <ProfileComponent
            currentPage={currentPage}
            onProfileEdit={() => console.log('onProfileEdit')}
            onOpenSetting={onOpenSetting}
            onOpenNotification={() => console.log('onOpenNotification')}
          />
        }
      />
    </>
  );
};

AppBar.propTypes = {
  title: PropTypes.string,
  currentPage: PropTypes.string,
  onOpenSetting: PropTypes.func,
};

AppBar.defaultProps = {
  title: '',
  currentPage: '',
  onOpenSetting: () => {},
};

export default AppBar;
