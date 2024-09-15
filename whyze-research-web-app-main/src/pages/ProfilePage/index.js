import React, { useEffect, useState } from 'react';
import RenameModal from './RenameModal';
import './Profile.scss';
import { Badge, Pencil, ProfileEmail, ProfilePhoneNumber } from '../../assets';
import { Text, Avatar } from '../../components/basic';
import { Divider } from 'antd';
import ContactModal from './ContactModal';
import {
  AuthProfile,
  CompanyEmail,
  PhoneNumber,
  ContactDetails,
} from '../../constant/ConstantTexts';
import { useSelector } from 'react-redux';
import useProfileComponentService from '../../components/shared/AppBar/ProfileComponent/useProfileComponentService';
import { setLoading } from '../../redux/reducer/authReducer';
import { useDispatch } from 'react-redux';

const ProfilePage = () => {
  const [profilemodalisOpen, setProfileModalIsOpen] = useState(false);
  const [conatactmodalisOpen, setConatactModalIsOpen] = useState(false);
  const { saveProfileData } = useProfileComponentService();
  const { userDetails, profileCount } = useSelector(
    (state) => state.authReducer,
  );
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setUser(userDetails);
  }, [userDetails]);

  const handleUpdateProfile = async (type) => {
    const userData = {
      name: user.name,
      research_title: user.research_title,
    };
    const contactData = {
      email: user.email,
      phone: user.phone,
    };
    dispatch(setLoading(true));
    await saveProfileData(type === 'userData' ? userData : contactData);
    dispatch(setLoading(false));
    setProfileModalIsOpen(false);
    setConatactModalIsOpen(false);
  };

  return (
    <div className="Profile-container">
      <div className="Profile-container_content">
        <div className="Profile-container_content-Name-wrapper">
          <Avatar
            user={userDetails}
            className="Profile-container_content-Name-wrapper-avatar"
            key={profileCount}
          />
          <div>
            <h1>{userDetails.name}</h1>
            <p>
              {userDetails.research_title}{' '}
              {userDetails.company_name && ` - ${userDetails.company_name}`}
            </p>
          </div>
          <div onClick={() => setProfileModalIsOpen(true)}>
            <Text className="profile-edit-text" text="Edit" />
            <Pencil />
          </div>
        </div>
        <p className="Profile-container_content_authenticated-badge">
          <Badge />

          {AuthProfile}
        </p>
        <Divider />
        <div>
          <div className="Profile-container_content_contact">
            <h3>{ContactDetails}</h3>
            <div
              className="Profile-container_content_contact-Edit-icon"
              onClick={() => setConatactModalIsOpen(true)}
            >
              <Text className="profile-edit-text" text="Edit" />
              <Pencil />
            </div>
          </div>
          <div className="Profile-container_content_PhoneNumber-Wrapper">
            <ProfileEmail />
            <div>
              <h3>{CompanyEmail}</h3>
              <p>{userDetails.email}</p>
            </div>
          </div>
          <div className="Profile-container_content_PhoneNumber-Wrapper">
            <ProfilePhoneNumber />
            <div>
              <h3>{PhoneNumber}</h3>
              <p>{userDetails.phone || '-'}</p>
            </div>
          </div>
        </div>
        <RenameModal
          user={user}
          isOpen={profilemodalisOpen}
          handleClose={() => setProfileModalIsOpen(false)}
          setUser={setUser}
          handleSave={() => handleUpdateProfile('userData')}
        />
        <ContactModal
          user={user}
          isOpen={conatactmodalisOpen}
          handleClose={() => setConatactModalIsOpen(false)}
          setUser={setUser}
          handleSave={() => handleUpdateProfile('contactData')}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
