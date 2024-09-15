import React from 'react';
import PropsTypes from 'prop-types';
import { Avatar } from '../../../../basic';
import { Exit, Invite, Profile } from '../../../../../assets';
import './ProfileData.scss';

const ProfileData = (props) => {
  const data = [
    {
      icon: (
        <div className="icon-wrapper">
          <Avatar user={props?.user} key={props.key} />
        </div>
      ),
      label: (
        <div className="profile_name_wrapper">
          <h5>{props?.name}</h5>
          <p>Role / Admin</p>
        </div>
      ),
      key: props?.name,
    },

    {
      type: 'divider',
    },
    { icon: <Profile />, label: 'Profile', key: 'Profile' },
    { icon: <Invite />, label: 'Invite', key: 'Invite' },
    {
      type: 'divider',
    },
    {
      icon: <Exit />,
      label: <div className="Logout_wrapper">Logout</div>,
      key: 'Logout',
    },
  ];
  return data;
};

ProfileData.propsTypes = {
  name: PropsTypes.string,
};
ProfileData.defalutProps = {
  name: '',
};
export default ProfileData;
