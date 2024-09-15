import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../../components/hoc';
import { Avatar, Input, Text } from '../../../components/basic';
import { Pencil } from '../../../assets';
import {
  cancelButtonLabel,
  fullNameLabel,
  renameModalTitle,
  saveButtonLabel,
  titleLabel,
} from '../../../constant/ConstantTexts';
import UploadPictureModal from './UploadProfileModal';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../redux/reducer/authReducer';
import useProfileComponentService from '../../../components/shared/AppBar/ProfileComponent/useProfileComponentService';
import { useSelector } from 'react-redux';

export default function RenameModal(props) {
  const { isOpen, handleClose, handleSave, user, setUser } = props;
  const [Open, setOpen] = useState(false);
  const [imgCrop, setImgCrop] = useState(false);
  const [storeImage, setStoreImage] = useState();
  const dispatch = useDispatch();
  const { saveProfileImage } = useProfileComponentService();
  const { profileCount } = useSelector((state) => state.authReducer);

  const onCrop = (view) => {
    setImgCrop(view);
  };

  const onClose = () => {
    setImgCrop(null);
  };

  const saveImage = async () => {
    setStoreImage(imgCrop);
    dispatch(setLoading(true));
    await saveProfileImage(imgCrop);
    setOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleClose();
        setStoreImage('');
      }}
      closable
      title={
        <div className="rename-modal-container">
          <Text className="rename-modal-text" text={renameModalTitle} />
        </div>
      }
      width={680}
      handleActionClick={handleSave}
      okButtonLabel={saveButtonLabel}
      cancelButtonLabel={cancelButtonLabel}
    >
      <div className="rename-modal-content">
        <div className="rename-modal-content-container">
          <div className="rename-modal-avatar-container">
            {storeImage ? (
              <img
                className={
                  user.image
                    ? 'rename-modal-avatar-image'
                    : 'rename-modal-avatar'
                }
                src={storeImage}
                alt=""
                onClick={() => setOpen(true)}
              />
            ) : (
              <Avatar
                key={profileCount}
                className={
                  user.image
                    ? 'rename-modal-avatar-image'
                    : 'rename-modal-avatar'
                }
                user={user}
              />
            )}
            <div className="rename-modal-avatar-edit-icon">
              <Pencil onClick={() => setOpen(true)} />
            </div>
          </div>
          <div className="rename-modal-input">
            <Input
              id="profile_text"
              lable={fullNameLabel}
              value={user?.name}
              handleInputChange={(e) =>
                setUser((previousState) => ({
                  ...previousState,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="rename-modal-input">
            <Input
              id="profile_text"
              lable={titleLabel}
              value={user?.research_title}
              handleInputChange={(e) =>
                setUser((previousState) => ({
                  ...previousState,
                  research_title: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>
      <UploadPictureModal
        Open={Open}
        handleClose={() => setOpen(false)}
        handleActionClick={saveImage}
        onCrop={onCrop}
        onClose={onClose}
      />
    </Modal>
  );
}

RenameModal.propTypes = {
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

RenameModal.defalutProps = {
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
