import React, { useEffect, useState } from 'react';
import './sites.scss';
import Card from '../../../components/hoc/card';
import {
  Sites,
  Location,
  Filter,
  Drag,
  Link,
  UserDelete,
  Location2,
  Star,
  Divider,
  AddIconGreenUnShaded,
  UserCheck,
  UserAdd,
} from '../../../assets';
import { DropDown } from '../../../components/basic';
import { sitesFilterOptions } from '../../../constant/DropdownData/DropdownData';
import { Button, Row, Col } from 'antd';
import { ConditionContainer } from '../../../components/shared';
import SitesInformationModal from './SitesInformationModal';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../../redux/reducer/feasibilityStudyReducer';
import useSitesService from './useSitesService';

export default function SitesTab() {
  const [expand, setExpand] = useState(false);
  const [expandIndex, setExpandIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [sitesdetails, setSitesdetails] = useState([]);
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const { getConnectedSitesPatientCount } = useSitesService();
  const dispatch = useDispatch();

  const handleExpandlink = (index) => {
    setExpand(!expand);
    setExpandIndex(index);
  };

  useEffect(() => {
    const newSegments = JSON.parse(JSON.stringify(segments));

    const sitesId =
      newSegments?.[activeSegment.index]?.sites?.map((ele) => ele._id) ?? [];
    newSegments[activeSegment.index].preferredSites = newSegments[
      activeSegment.index
    ]?.preferredSites?.filter((elem) => sitesId.includes(elem._id));
    dispatch(setSegments(newSegments));
  }, [segments[activeSegment.index]?.preferredSites?.length > 0]);

  useEffect(() => {
    getConnectedSitesPatientCount({
      caseStudy: segments[activeSegment.index]?.feasibilityStudy,
      country: segments[activeSegment.index]?.selectedCountries,
    });
  }, []);
  const OnClickAddedSiteData = (data) => {
    const newSegments = JSON.parse(JSON.stringify(segments));

    if (
      newSegments[activeSegment.index]?.preferredSites.findIndex(
        (ele) => ele._id === data._id,
      ) === -1
    ) {
      newSegments[activeSegment.index]?.preferredSites?.push(data);
      dispatch(setSegments(newSegments));
    }
    setOpen(false);
  };

  return (
    <>
      <>
        <Card
          className={'card-head-sites'}
          title={{
            name: (
              <div className="sites-title-card">
                <div className="sites-title-card-title">Sites</div>
                <div className="sites-title-card-description">
                  <div className="sites-title-card-description-sites">
                    <Sites />
                  </div>
                  <div className="sites-title-card-description-sites">
                    {segments[activeSegment.index].sites?.length || 0}
                  </div>
                  <div className="sites-title-card-description-sites">
                    <Location />
                  </div>
                  <div className="sites-title-card-description-sites">
                    {`${
                      segments[activeSegment.index].selectedCountries?.length
                    } Countries`}
                  </div>
                </div>
              </div>
            ),
          }}
          extra={
            <div className="filter-box">
              <DropDown items={sitesFilterOptions}>
                <Button className="filter-box-button">
                  <div className="filter-box-text-icon">
                    <div className="filter-box-text">Filter</div>
                    <div>
                      <Filter />
                    </div>
                  </div>
                </Button>
              </DropDown>
            </div>
          }
        >
          <div className="sites-children-body">
            {segments[activeSegment.index]?.sites?.map((ele, index) => (
              <div
                key={index}
                className="sites-children"
                onClick={() => setSitesdetails(ele)}
              >
                <Col md={1}>
                  <Drag />
                </Col>
                <ConditionContainer
                  className={'condition-container'}
                  isActive
                  isVertical
                >
                  <Row className="sites-children-wrapper">
                    <Col>
                      <Row className="sites-children-wrapper-university">
                        {ele.name}
                      </Row>
                      {ele.isLinked && (
                        <div onClick={() => handleExpandlink(index)}>
                          <Row className="sites-children-wrapper-linked">
                            <Link />
                            {ele.noOfLinks === 1
                              ? `${ele.noOfLinks} linked site`
                              : `${ele.noOfLinks} linked sites`}
                          </Row>
                          {expand &&
                            expandIndex === index &&
                            ele?.linkedData?.map((list, idx) => (
                              <Row key={idx}>
                                <div className="sites-children-wrapper-linked-data">
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    {idx + 1}.
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    {list.name}
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    <UserCheck />
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    {list.noOfConnectedSites}
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    <Divider />
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    <UserDelete />
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    {list.noOfNotConnectedSites}
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    <Divider />
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    {list.star}
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    <Star />
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    <Location2 />
                                  </Col>
                                  <Col className="sites-children-wrapper-linked-data-col">
                                    {list.city}
                                  </Col>
                                </div>
                              </Row>
                            ))}
                        </div>
                      )}
                      <Row className="sites-children-wrapper-usersAndLocation">
                        <Col className="sites-children-wrapper-usersAndLocation-col">
                          <UserAdd />
                          {ele.connected}
                        </Col>
                        <Divider className="sites-children-wrapper-usersAndLocation-col-icon" />
                        <Col className="sites-children-wrapper-usersAndLocation-col">
                          <UserDelete />
                          {ele.not_connected_sites}
                        </Col>
                        <Divider className="sites-children-wrapper-usersAndLocation-col-icon" />
                        <Col className="sites-children-wrapper-usersAndLocation-col">
                          {ele.rating}
                          <Star />
                        </Col>
                        <Divider className="sites-children-wrapper-usersAndLocation-col-icon" />
                        <Col className="sites-children-wrapper-usersAndLocation-col">
                          <Location2 />
                          {ele.city}
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <AddIconGreenUnShaded
                        className="sites-children-wrapper-add-icon"
                        onClick={() => setOpen(true)}
                      />
                    </Col>
                  </Row>
                </ConditionContainer>
              </div>
            ))}
          </div>
        </Card>
      </>

      <SitesInformationModal
        isOpen={open}
        onClose={setOpen}
        sitesdetails={sitesdetails}
        AddedSiteData={OnClickAddedSiteData}
      />
    </>
  );
}
