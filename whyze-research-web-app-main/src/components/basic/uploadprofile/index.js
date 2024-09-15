import React from 'react';
import Avatar from 'react-avatar-edit';
import PropTypes from 'prop-types';
const UploadPicture = ({ src, onClose, onCrop }) => {
  return (
    <Avatar
      width={450}
      height={400}
      src={src}
      onCrop={onCrop}
      onClose={onClose}
    />
  );
};
UploadPicture.propTypes = {
  src: PropTypes.object,
  preview: PropTypes.bool,
  onClose: PropTypes.func,
  onCrop: PropTypes.func,
};
UploadPicture.defalutProps = {
  src: null,
  preview: false,
  onClose: () => {},
  onCrop: () => {},
};
export default UploadPicture;
