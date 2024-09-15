import { Divider } from 'antd';
import React from 'react';
import { Contact, Initiated, Sites } from '../../../../assets';
import { Text } from '../../../../components/basic';
import PropTypes from 'prop-types';
export default function SiteOverview({
  preferredSitesCount,
  sitesInitiatedCount,
  sitesContactedCount,
}) {
  return (
    <div className="site-overview">
      <Text className="site-overview-title" text="Sites overview" />
      <div className="site-overview-container">
        <div className="site-overview-alignment">
          <div className="site-overview-vertical-alignment">
            <div className="site-overview-icon">
              <Sites />
            </div>
            <Text className="site-overview-value" text={preferredSitesCount} />
          </div>
          <Text className="site-overview-text" text="Sites" />
        </div>
        <Divider className="site-overview-divider" type="vertical" />
        <div className="site-overview-alignment">
          <div className="site-overview-vertical-alignment">
            <div className="site-overview-icon">
              <Contact />
            </div>
            <Text className="site-overview-value" text={sitesContactedCount} />
          </div>
          <Text className="site-overview-text" text="Contacted" />
        </div>
        <Divider className="site-overview-divider" type="vertical" />
        <div className="site-overview-alignment">
          <div className="site-overview-vertical-alignment">
            <div className="site-overview-icon">
              <Initiated />
            </div>
            <Text className="site-overview-value" text={sitesInitiatedCount} />
          </div>
          <Text className="site-overview-text" text="Initiated" />
        </div>
      </div>
    </div>
  );
}

SiteOverview.propTypes = {
  preferredSitesCount: PropTypes.number,
  sitesInitiatedCount: PropTypes.number,
  sitesContactedCount: PropTypes.number,
};
SiteOverview.defaultProps = {
  preferredSitesCount: 0,
  sitesInitiatedCount: 0,
  sitesContactedCount: 0,
};
