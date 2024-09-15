import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../../components/hoc';
import { Input, Text } from '../../../components/basic';
import {
  saveButtonLabel,
  cancelButtonLabel,
  Phone,
  EmailAddress,
  contactDetailsLabel,
} from '../../../constant/ConstantTexts';

export default function ContactModal(props) {
  const { isOpen, handleClose, handleSave, user, setUser } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closable
      title={
        <div className="rename-modal-container">
          <Text className="rename-modal-text" text={contactDetailsLabel} />
        </div>
      }
      width={680}
      handleActionClick={handleSave}
      okButtonLabel={saveButtonLabel}
      cancelButtonLabel={cancelButtonLabel}
    >
      <div className="rename-modal-content">
        <div className="rename-modal-content-container">
          <div className="rename-modal-avatar-container"></div>
          <div className="rename-modal-input">
            <Input
              id="profile_text"
              lable={EmailAddress}
              value={user?.email}
              handleInputChange={(e) =>
                setUser((previousState) => ({
                  ...previousState,
                  email: e.target.value,
                }))
              }
              disabled={true}
            />
          </div>
          <div className="rename-modal-input">
            <Input
              id="profile_text"
              lable={Phone}
              value={user?.phone}
              handleInputChange={(e) =>
                setUser((previousState) => ({
                  ...previousState,
                  phone: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

ContactModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSave: PropTypes.func,
  setUser: PropTypes.func,
  user: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      title: PropTypes.string,
      companyName: PropTypes.string,
      id: PropTypes.number,
    }),
  ),
};

ContactModal.defalutProps = {
  isOpen: false,
  handleClose: () => {},
  handleSave: () => {},
  setUser: () => {},
  user: {
    name: '',
    image: '',
    title: '',
    companyName: '',
    id: 1,
  },
};
