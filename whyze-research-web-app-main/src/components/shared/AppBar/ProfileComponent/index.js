import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Divider, Row, Space, Typography } from 'antd';
import { Avatar, Image, Button, DropDown } from '../../../basic';
import SettingsIcon from '../../../../assets/settings.svg';
import NotificationIcon from '../../../../assets/notification.svg';
import { EyeFilled } from '@ant-design/icons';
import ProfileData from './ProfileData';
import { useNavigate } from 'react-router-dom';
import SettingModal from '../../SettingModal';
import { useSelector } from 'react-redux';
import { clearSettings } from '../../../../redux/reducer/projectsReducer';
import { useDispatch } from 'react-redux';

const ProfileComponent = ({
  currentPage,
  onProfileEdit,
  onOpenSetting,
  onOpenNotification,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails, profileCount } = useSelector(
    (state) => state.authReducer,
  );
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };
  const handleButtonClick = (e) => {
    if (e.key === 'Profile') {
      navigate('/profile');
    } else if (e.key === 'Logout') {
      handleLogout();
    }
  };
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
    dispatch(clearSettings());
  };

  return (
    <>
      <Row className="appbar-alignCenter">
        {(currentPage === 'new-feasibility-study/:id' ||
          currentPage === 'screen-survey') && (
          <div className="appbar-alignCenter">
            <div className="avatar">
              {userDetails.length > 0 &&
                userDetails?.map((user, index) => (
                  <div
                    className="avatar-container"
                    style={{
                      zIndex: userDetails.length - (index + 1),
                    }}
                    key={`Avatar-${index}`}
                  >
                    <Avatar
                      size={40}
                      user={user}
                      handleClickAvatar={onProfileEdit}
                      key={profileCount}
                    />
                  </div>
                ))}
            </div>
            <div>
              <Divider
                orientation="left"
                type="vertical"
                style={{
                  borderLeft: '1px solid rgba(45, 51, 57, 0.08)',
                  marginLeft: '5px',
                }}
              />
            </div>
            <div>
              <Image
                preview={false}
                style={{ cursor: 'pointer' }}
                src={SettingsIcon}
                onClick={() => onOpenSetting(currentPage)}
              />
            </div>
          </div>
        )}
        {currentPage === 'new-feasibility-study-view' && (
          <Row className="appbar-alignCenter">
            <Col span={18}>
              <Typography className="ant-page-header-heading-sub-title">
                View Only
              </Typography>
            </Col>
            <Col span={6}>
              <EyeFilled style={{ fontSize: '30px', marginTop: '5px' }} />
            </Col>
          </Row>
        )}
        {(currentPage === 'dashboard' ||
          currentPage === 'profile' ||
          currentPage === 'feasibility-studies-in-planning') && (
          <Space className="appbar-alignCenter" width="400px">
            {currentPage === 'dashboard' ||
              (currentPage === 'feasibility-studies-in-planning' && (
                <Button
                  className="appbar-new-study-button"
                  label="New study"
                  handleButtonClick={() => setOpenModal(true)}
                />
              ))}
            <Image
              style={{ cursor: 'pointer' }}
              preview={false}
              width={21}
              height={26}
              src={NotificationIcon}
              onClick={() => onOpenNotification()}
            />
            <Divider
              orientation="left"
              type="vertical"
              style={{
                borderLeft: '1px solid rgba(45, 51, 57, 0.08)',
                margin: '0px 16px',
              }}
            />

            <DropDown
              items={ProfileData({
                name: userDetails?.name,
                user: userDetails,
                key: profileCount,
              })}
              onChange={(e) => handleButtonClick(e)}
            >
              <div>
                <Avatar
                  size={40}
                  user={userDetails}
                  handleClickAvatar={onProfileEdit}
                  key={profileCount}
                />
              </div>
            </DropDown>
          </Space>
        )}
      </Row>
      <SettingModal
        openModal={openModal}
        handleClose={handleClose}
        type="create"
      />
    </>
  );
};

ProfileComponent.propTypes = {
  currentPage: PropTypes.string,
  users: PropTypes.array,
  user: PropTypes.object,
  onProfileEdit: PropTypes.func,
  onOpenSetting: PropTypes.func,
  onNewStudy: PropTypes.func,
  onOpenNotification: PropTypes.func,
};

ProfileComponent.defalutProps = {
  currentPage: '',
  users: [],
  user: null,
  onProfileEdit: null,
  onOpenSetting: null,
  onNewStudy: null,
  onOpenNotification: null,
};

export default ProfileComponent;
