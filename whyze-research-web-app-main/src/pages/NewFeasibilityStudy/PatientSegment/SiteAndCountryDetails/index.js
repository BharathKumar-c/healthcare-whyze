import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { Text } from '../../../../components/basic';
import { InfoCircleFilled } from '@ant-design/icons';
import { Popover } from '../../../../components/hoc';

export default function SiteAndCountryDetails({
  icon,
  value,
  title,
  isInfo,
  tab,
}) {
  const content = (
    <div className="content">
      Additional Whyze patients in site catchment areas, but not yet connected
      to these sites.
    </div>
  );
  return (
    <div className="site-container">
      <Row align="middle" wrap style={{ marginBottom: '10px' }}>
        <Col span={12}>
          <div
            className={
              isInfo ? 'site-container-icon-grey-bg' : 'site-container-icon'
            }
          >
            {icon}
          </div>
        </Col>
        <Col span={12}>
          <Text className="no-of-patients" text={value} />
        </Col>
      </Row>
      <Row align="middle">
        <Col span={isInfo ? 22 : 24}>
          <Text
            className={
              tab === 'feasibility' || tab === 'location'
                ? 'patient-segment-title'
                : 'patient-segment-title-small'
            }
            text={title}
          />
        </Col>
        {isInfo && (
          <Col span={2}>
            <Popover
              id="not-connected-patients"
              trigger="hover"
              content={content}
              placement="bottomRight"
            >
              <InfoCircleFilled />
            </Popover>
          </Col>
        )}
      </Row>
    </div>
  );
}

SiteAndCountryDetails.propTypes = {
  value: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.node,
  isInfo: PropTypes.bool,
  tab: PropTypes.string,
};

SiteAndCountryDetails.defaultProps = {
  value: '',
  title: '',
  icon: null,
  isInfo: false,
  tab: '',
};
