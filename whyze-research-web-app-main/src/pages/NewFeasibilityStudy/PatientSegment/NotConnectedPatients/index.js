import React from 'react';
import PropTypes from 'prop-types';
import { UserDelete } from '../../../../assets';
import { Popover } from '../../../../components/hoc';
import { InfoCircleFilled } from '@ant-design/icons';

export function NotConnectedPatients(props) {
  const { noOfNotConncetedPatients } = props;

  const content = (
    <div className="content">
      Additional Whyze patients in site catchment areas, but not yet connected
      to these sites.
    </div>
  );
  return (
    <div className="not-connected-patients-container">
      <div className="alignment">
        <UserDelete />
        <div className="no-of-patients-text">{noOfNotConncetedPatients}</div>
      </div>
      <div className="alignment">
        <div className="sites-text">Not connected to sites</div>
        <Popover
          id="not-connected-patients"
          trigger="hover"
          content={content}
          placement="bottomRight"
        >
          <InfoCircleFilled />
        </Popover>
      </div>
    </div>
  );
}

NotConnectedPatients.propTypes = {
  noOfNotConncetedPatients: PropTypes.number,
};

NotConnectedPatients.defaultProps = {
  noOfNotConncetedPatients: 0,
};
