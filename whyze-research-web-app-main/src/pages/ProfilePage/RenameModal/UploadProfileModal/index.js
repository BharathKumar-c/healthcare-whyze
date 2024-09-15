import React from 'react';

import {
  cancelButtonLabel,
  okButtonLabel,
} from '../../../../constant/ConstantTexts';
import PropTypes from 'prop-types';
import { Modal } from '../../../../components/hoc';
import { UploadProfile } from '../../../../components/basic';

const UploadPictureModal = ({
  Open,
  handleClose,
  onCrop,
  onClose,
  handleActionClick,
}) => {
  return (
    <Modal
      isOpen={Open}
      onClose={handleClose}
      okButtonLabel={okButtonLabel}
      cancelButtonLabel={cancelButtonLabel}
      handleActionClick={handleActionClick}
    >
      <UploadProfile onCrop={onCrop} onClose={onClose} />
    </Modal>
  );
};
UploadPictureModal.propTypes = {
  Open: PropTypes.bool,
  handleClose: PropTypes.func,
  onCrop: PropTypes.func,
  onClose: PropTypes.func,
  handleActionClick: PropTypes.func,
};
UploadPictureModal.defalutProps = {
  Open: false,
  handleClose: () => {},
  onCrop: () => {},
  onClose: () => {},
  handleActionClick: () => {},
};

export default UploadPictureModal;
