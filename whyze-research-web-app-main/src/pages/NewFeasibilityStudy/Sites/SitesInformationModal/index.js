import React from 'react';
import { Modal } from '../../../../components/hoc';
import PropTypes from 'prop-types';
import { SitesgreenBg, Location } from '../../../../assets';
import './SitesInformationModal.scss';
import SitesInfomationModalContent from '../SitesInformationModal/SitesinfomationModalContent';

const SitesInformationModal = (props) => {
  const handleClose = () => {
    props.onClose(false);
  };

  return (
    <Modal
      className={'modal-container'}
      isOpen={props.isOpen}
      onClose={handleClose}
      okButtonLabel={'add'}
      closable
      handleActionClick={() => props.AddedSiteData(props.sitesdetails)}
      width={600}
      title={
        <div className="modal-title-container">
          <div>
            <SitesgreenBg />
            <h6>{props.sitesdetails.name}</h6>
          </div>
          <div>
            <Location />
            <h6>{props.sitesdetails.city}</h6>
          </div>
        </div>
      }
      cancelButtonLabel={'Cancel'}
    >
      <SitesInfomationModalContent sitesdetails={props.sitesdetails} />
    </Modal>
  );
};

SitesInformationModal.propTypes = {
  sitesdetails: PropTypes.object,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  onClose: PropTypes.bool,
  AddedSiteData: PropTypes.func,
};

SitesInformationModal.defaultProps = {
  sitesdetails: null,
  index: null,
  isOpen: false,
  onClose: false,
  AddedSiteData: () => {},
};

export default SitesInformationModal;
