import React from 'react';
import PropTypes from 'prop-types';
import {
  Connectsites,
  WhyzeCatchment,
  Trending,
  Email,
  Phonenumber,
  Divider,
} from '../../../../../assets';
import '../SitesInformationModal.scss';
import { Row, Col } from 'antd';
import { Rate, Tag } from '../../../../../components/basic';
import { siteConst } from '../../../../../constant/ConstantTexts';

const SitesInfomationModalContent = (props) => {
  return (
    <>
      <div className="modal-children-container">
        <div className="modal-children-container_patient-segment-container">
          <h4>{siteConst.siteInformationCosnt.patientSegmentHeader}</h4>
          <Row>
            <Col span={10}>
              <div className="Connectsites">
                <Connectsites />
                <h3>{props.sitesdetails.connected}</h3>
              </div>
              <p>{siteConst.siteInformationCosnt.connectedWithSite}</p>
            </Col>
            <Col span={4}>
              <Divider />
            </Col>
            <Col span={10}>
              <div className="Catchmentsites">
                <WhyzeCatchment />
                <h3>{props.sitesdetails.not_connected_sites}</h3>
              </div>
              <p>{siteConst.siteInformationCosnt.additionalCatchmentAreas}</p>
            </Col>
          </Row>
        </div>
        <div className="modal-children-container_patient-segment-rating">
          <Row>
            <Col
              span={9}
              className="modal-children-container_patient-segment-rating-star"
            >
              <h3>
                {props.sitesdetails.rating}
                &nbsp;&nbsp;
                <Rate
                  defaultvalue={props.sitesdetails.rating}
                  value={props.sitesdetails.rating}
                />
              </h3>
              <p>{siteConst.siteInformationCosnt.sitePerformance}</p>
            </Col>
            <Col span={9}>
              <h3>0.0 months</h3>
              <p>{siteConst.siteInformationCosnt.recruitmentTimeline}</p>
            </Col>
            <Col span={6}>
              <h3>
                <Trending />
                &nbsp; 00.00%
              </h3>

              <p>
                {' '}
                &nbsp; &nbsp; &nbsp;{siteConst.siteInformationCosnt.dropOutRate}
              </p>
            </Col>
          </Row>
        </div>
      </div>
      <div className="modal-children-container_track-recoder-container">
        <h4> {siteConst.siteInformationCosnt.trackRecordOfDoingTrials}</h4>
        <Row>
          <Col className="rating-wrapper">
            <div>
              <h3>
                {' '}
                <Trending />
                {'XX trials'}
              </h3>
            </div>
            <p>{siteConst.siteInformationCosnt.completedInThePastyear}</p>
          </Col>
        </Row>
      </div>
      <div className="modal-children-container_details-container">
        <Row>
          <Col span={12}>
            <div className="Primary-Investigator">
              <h3>{'Name Surname'}</h3>
            </div>
            <p>{siteConst.siteInformationCosnt.primaryInvestigator}</p>
            <h4>
              <Phonenumber />
              {props.sitesdetails.phone_number}
            </h4>
            <h4>
              <Email />

              {props.sitesdetails.email}
            </h4>
          </Col>

          <Col span={12}>
            <div className="Administration-Investigator">
              <h3>{'Name Surname'}</h3>
            </div>
            <p>{siteConst.siteInformationCosnt.administration}</p>
            <h4>
              <Phonenumber />
              {props.sitesdetails.phone_number}
            </h4>
            <h4>
              <Email />
              {props.sitesdetails.email}
            </h4>
          </Col>
        </Row>
      </div>
      <div className="modal-children-container_industry-avarage-rating">
        <Row>
          <Col span={6}>
            <div>
              <h3>
                {' '}
                <Trending />
                00.00%
              </h3>
              <p>{siteConst.siteInformationCosnt.screenFailRate}</p>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <Tag icon={<Trending />} color={'error'} className="tag">
                26.7%
              </Tag>

              <p>{siteConst.siteInformationCosnt.industryAverage}</p>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <h3>
                {' '}
                <Trending />
                00.00%
              </h3>
              <p>{siteConst.siteInformationCosnt.avgResponseTime}</p>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <Tag icon={<Trending />} color={'error'} className="tag">
                2.5 months
              </Tag>
              <p>{siteConst.siteInformationCosnt.industryAverage}</p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
SitesInfomationModalContent.propTypes = {
  sitesdetails: PropTypes.object,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  AddedSiteData: PropTypes.func,
};

SitesInfomationModalContent.defaultProps = {
  sitesdetails: null,
  index: null,
  isOpen: false,
  onClose: () => {},
  AddedSiteData: () => {},
};
export default SitesInfomationModalContent;
