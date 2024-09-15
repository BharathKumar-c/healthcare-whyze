import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Image } from 'antd';
import './Avatar.scss';
import useProfileComponentService from '../../shared/AppBar/ProfileComponent/useProfileComponentService';
export default function AvatarComp({
  className,
  size,
  user,
  handleClickAvatar,
  key,
}) {
  const [imgSource, setImgSource] = useState();
  const { getProfilePicture } = useProfileComponentService();
  const { profile_pic_key, id } = user;
  const profName = user.name;
  const splitedName = profName ? profName.split(' ') : '';
  let initialName = '';
  if (splitedName && splitedName[0]) {
    initialName = splitedName[0][0];
  }
  if (splitedName && splitedName[1]) {
    initialName = `${initialName} ${splitedName[1][0]}`;
  }

  useEffect(() => {
    async function fetchProfilePicture() {
      const imgSource = await getProfilePicture(profile_pic_key);
      setImgSource(imgSource);
    }
    fetchProfilePicture();
  }, [profile_pic_key]);
  return (
    <>
      {profile_pic_key ? (
        <Avatar
          onClick={() => handleClickAvatar(id)}
          className={className}
          size={size}
          src={<Image preview={false} src={imgSource} />}
          key={key}
        />
      ) : (
        <Avatar
          onClick={() => handleClickAvatar(id)}
          className={className}
          size={size}
          style={{ backgroundColor: '#E9FCFC', verticalAlign: 'middle' }}
        >
          {initialName}
        </Avatar>
      )}
    </>
  );
}

AvatarComp.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  user: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      id: PropTypes.number,
      split: PropTypes.func,
    }),
  ),
  handleClickAvatar: PropTypes.func,
  key: PropTypes.number,
};

AvatarComp.defaultProps = {
  className: '',
  size: 20,
  user: {
    name: '',
    image: '',
    id: 1,
    split: () => {},
  },
  handleClickAvatar: null,
  key: 0,
};
