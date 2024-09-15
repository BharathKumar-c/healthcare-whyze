import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../hoc';
import Title from './TitleComponent';
import WhyzeLogo from '../../../assets/WhyzeLogo.svg';
import './SettingModal.scss';
import ProjectSetting from './ProjectSetting';
import { projectSettingConstants } from '../../../constant/ConstantTexts';
import { useSelector } from 'react-redux';
import { validateDataForProjectSetting } from '../../../utils/CommonFunction';
import useSaveandCloseService from '../../../pages/NewFeasibilityStudy/FooterNewFeasibilityStudy/SaveAndClose/useSaveandCloseService';
export default function SettingModal({ openModal, handleClose, type }) {
  const { clinicalTrial, sponsor, description, standards, measurement } =
    useSelector((state) => state.projectReducer);
  const data = {
    clinicalTrial,
    sponsor,
    description,
    standards,
    measurement,
  };
  const [errors, setErrors] = useState({});
  const { updateUserProject, createUserProject } = useSaveandCloseService();
  const createProject = async (data) => {
    const validationErrors = validateDataForProjectSetting(data);
    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      setErrors({
        clinicalTrial: false,
        sponsor: false,
        description: false,
      });

      type === 'edit' ? updateUserProject(data) : createUserProject(data);
      handleClose();
    }
  };

  return (
    <Modal
      className="setting-modal"
      isOpen={openModal}
      onClose={() => {
        handleClose();
        setErrors({});
      }}
      closable
      title={
        <Title
          title={projectSettingConstants.projectSettings}
          logo={WhyzeLogo}
        />
      }
      width={600}
      handleActionClick={() => createProject(data)}
      okButtonLabel={'Save'}
      cancelButtonLabel={'Cancel'}
    >
      {openModal && <ProjectSetting data={data} errors={errors} />}
    </Modal>
  );
}

SettingModal.propTypes = {
  openModal: PropTypes.object,
  handleClose: PropTypes.func,
  type: PropTypes.string,
};

SettingModal.defalutProps = {
  openModal: {},
  handleClose: () => {},
  type: '',
};
