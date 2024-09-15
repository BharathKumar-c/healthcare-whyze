import React from 'react';
import PropTypes from 'prop-types';
import { Input, TextArea } from '../../../../components/basic';
import { Modal } from '../../../../components/hoc';
import WhyzeLogo from '../../../../assets/WhyzeLogo.svg';
import './../FooterNewFeasibilityStudy.scss';
import Title from '../FooterModalTitleComponent';
import {
  cancelButtonLabel,
  SaveAndCloseModalConst,
  saveButtonLabel,
} from '../../../../constant/ConstantTexts';

export default function SaveAndCloseModal({
  openModal,
  handleClose,
  handleSave,
  handleInputChange,
  errors,
  loading,
}) {
  return (
    <Modal
      className="save-and-close-modal"
      isOpen={openModal}
      onClose={handleClose}
      closable
      confirmLoading={loading}
      title={
        <Title
          title={SaveAndCloseModalConst.SaveAndCloseModalTitle}
          logo={WhyzeLogo}
          className="save-and-close-modal-title"
        />
      }
      width={450}
      handleActionClick={handleSave}
      okButtonLabel={saveButtonLabel}
      cancelButtonLabel={cancelButtonLabel}
    >
      <div className="save-and-close-modal-children">
        <Input
          id="main_textbox"
          lable={SaveAndCloseModalConst.projectNameInputLabel}
          name={'projectName'}
          placeholder={SaveAndCloseModalConst.projectNameInputPlaceholder}
          handleInputChange={(e) => handleInputChange(e)}
          isError={errors?.key === 'projectName' ? true : false}
          errorText={errors?.errors}
        />
        <Input
          id="main_textbox"
          lable={SaveAndCloseModalConst.clientNameInputLabel}
          name={'clientName'}
          placeholder={SaveAndCloseModalConst.clientNameInputLabel}
          handleInputChange={(e) => handleInputChange(e)}
          isError={errors?.key === 'clientName' ? true : false}
          errorText={errors?.errors}
        />
        <TextArea
          id="main_textbox"
          lable={SaveAndCloseModalConst.descriptionNameInputLabel}
          maxLength={200}
          name={'description'}
          placeholder={SaveAndCloseModalConst.descriptionNameInputLabel}
          handleInputChange={(e) => handleInputChange(e)}
          style={{ resize: 'none' }}
          isError={errors?.key === 'description' ? true : false}
          errorText={errors?.errors}
        />
        <div className="empty-tag" />
        <Input
          id="main_textbox"
          lable={SaveAndCloseModalConst.patientSegmentInputLabel}
          name={'patientSegmentReqiured'}
          placeholder={SaveAndCloseModalConst.patientSegmentInputLabel}
          handleInputChange={(e) => handleInputChange(e)}
          type={'number'}
          isError={errors?.key === 'patientSegmentReqiured' ? true : false}
          errorText={errors?.errors}
        />
      </div>
    </Modal>
  );
}

SaveAndCloseModal.propTypes = {
  openModal: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSave: PropTypes.func,
  handleInputChange: PropTypes.func,
  isError: PropTypes.bool,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};

SaveAndCloseModal.defalutProps = {
  openModal: false,
  handleClose: () => {},
  handleSave: () => {},
  handleInputChange: () => {},
  isError: false,
  loading: false,
  errors: {},
};
