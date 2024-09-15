import React from 'react';
import { Col, Row } from 'antd';
import { Text } from '../../../../components/basic';
import {
  CloseIcon,
  RightArrow,
  Sites,
  UserAdd,
  UserDelete,
  Vector,
} from '../../../../assets';
import './ProposedSiteList.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { proposedSiteListConstants } from '../../../../constant/ConstantTexts';

export default function ProposedSiteList() {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const dispatch = useDispatch();
  const { preferredSites } = segments[activeSegment.index];

  let connectedSites = preferredSites.reduce((a, b) => {
    return a + b.connected;
  }, 0);
  let notConnectedSites = preferredSites.reduce((a, b) => {
    return a + b.not_connected_sites;
  }, 0);

  const handleSeeMore = () => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    newSegments[activeSegment.index]?.tabs?.forEach((ele, index) => {
      if (ele.isActive) {
        ele.isActive = false;
        ele.position = 'left';
      } else if (index === 3) {
        ele.isActive = true;
      }
    });
    if (newSegments[activeSegment.index]?.tabs?.length === 4) {
      newSegments[activeSegment.index].activeTab = {
        name: newSegments[activeSegment.index].tabs[
          newSegments[activeSegment.index]?.activeTab?.index + 1
        ].name,
        index: newSegments[activeSegment.index]?.activeTab?.index + 1,
      };
    } else {
      newSegments[activeSegment.index].tabs.push({
        name: 'preferredList',
        title: 'PreferredList',
        isActive: true,
        position: 'left',
      });
      newSegments[activeSegment.index].activeTab = {
        name: 'preferredList',
        index: 3,
      };
    }
    dispatch(setSegments(newSegments));
  };

  const handleRemoveSite = (index) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const newSites = [...preferredSites];
    newSites.splice(index, 1);
    newSegments[activeSegment.index].preferredSites = [...newSites];
    dispatch(setSegments(newSegments));
  };

  return (
    <div className="proposed-site-list">
      <Text
        className="proposed-site-list-title"
        text={proposedSiteListConstants.title}
      />
      <div className="proposed-site-list-container">
        <Row>
          <Col span={14}>
            {preferredSites?.length === 0 ? (
              <Row>
                <Col span={8}>
                  <Row>
                    <Col span={10}>
                      <Vector
                        height={23}
                        width={18}
                        className="proposed-site-list-icon"
                      />
                    </Col>
                    <Col className="proposed-site-list-text" span={14}>
                      00
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={10}>
                      <Sites className="proposed-site-list-icon" />
                    </Col>
                    <Col className="proposed-site-list-text" span={14}>
                      00
                    </Col>
                  </Row>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col span={8}>
                  <Row>
                    <Col span={10}>
                      <Sites
                        height={17}
                        width={23}
                        className="proposed-site-list-icon"
                      />
                    </Col>
                    <Col className="proposed-site-list-text-active" span={14}>
                      {preferredSites?.length || 0}
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={10}>
                      <UserAdd className="proposed-site-list-icon" />
                    </Col>
                    <Col className="proposed-site-list-text-active" span={14}>
                      {connectedSites || 0}
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={10}>
                      <UserDelete className="proposed-site-list-icon" />
                    </Col>
                    <Col className="proposed-site-list-text-active" span={14}>
                      {notConnectedSites || 0}
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Col>
          <Col
            className={
              preferredSites.length === 0
                ? 'proposed-site-list-seemore-button'
                : 'proposed-site-list-seemore-button-active'
            }
            span={10}
            align="end"
            onClick={preferredSites.length === 0 ? null : handleSeeMore}
          >
            <Text
              className={
                preferredSites.length === 0
                  ? 'proposed-site-list-seemore-text'
                  : 'proposed-site-list-seemore-text-active'
              }
              text={proposedSiteListConstants.seeMore}
            />
            <RightArrow />
          </Col>
        </Row>
        {preferredSites.length === 0 ? (
          <div className="proposed-site-list-empty-container">
            <Text
              className="proposed-site-list-empty-text"
              text={proposedSiteListConstants.emptyContent}
            />
          </div>
        ) : (
          <div>
            {preferredSites.map((site, index) => (
              <Row key={index} className="proposed-site-list-sites-container">
                <Col span={20}>
                  <Row className="proposed-site-list-sites-content">
                    <Col span={4}>
                      <Sites className="proposed-site-list-icon" />
                    </Col>
                    <Col className="proposed-site-list-site-name" span={20}>
                      {site.name}
                    </Col>
                  </Row>
                </Col>
                <Col className="proposed-site-list-close-icon" span={4}>
                  <CloseIcon onClick={() => handleRemoveSite(index)} />
                </Col>
              </Row>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
