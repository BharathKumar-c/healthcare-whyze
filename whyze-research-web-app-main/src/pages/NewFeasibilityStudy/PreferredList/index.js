import React, { useState } from 'react';
import './preferredList.scss';
import Card from '../../../components/hoc/card';
import { preferredTabList } from '../../../constant';
import PreferredSitesTab from './PreferredSites';
import SitesContactedTab from './SitesContacted';
import SitesInitiatedTab from './SitesInitiated';

export default function PreferredList() {
  const [activeTabKey, setActiveTabKey] = useState('preferredSites');
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  return (
    <Card
      className={'card-head-preferred-list'}
      title={{
        name: (
          <div className="preferred-list-title-component">
            <div className="preferred-list-title-component-title">
              Preferred List
            </div>
          </div>
        ),
      }}
      tabList={preferredTabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {activeTabKey === 'preferredSites' ? (
        <PreferredSitesTab onTabChange={onTabChange} />
      ) : activeTabKey === 'sitesContacted' ? (
        <SitesContactedTab onTabChange={onTabChange} />
      ) : activeTabKey === 'sitesInitiated' ? (
        <SitesInitiatedTab onTabChange={onTabChange} />
      ) : null}
    </Card>
  );
}
