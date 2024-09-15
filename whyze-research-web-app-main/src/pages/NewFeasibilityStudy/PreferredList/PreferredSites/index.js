import React, { useEffect, useState } from 'react';
import './../preferredList.scss';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { ConditionContainer } from '../../../../components/shared';
import {
  Contact,
  DropDownArrowUp,
  Divider,
  Dropdown,
  Initiated,
  Link,
  Location2,
  Star,
  UserCheck,
  UserDelete,
} from '../../../../assets';
import SitesInfomationModalContent from '../../Sites/SitesInformationModal/SitesinfomationModalContent';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { Checkbox } from '../../../../components/basic';
import PaginationAndOptions from '../PaginationAndOptions';

function findNoOfSelectedSites(array, currentPage, sitesPerPage) {
  let count = 0;
  array?.forEach((ele, index) => {
    if (
      index < currentPage * sitesPerPage &&
      index >= (currentPage - 1) * sitesPerPage &&
      ele.isChecked
    ) {
      count += 1;
    }
  });

  return count;
}

export default function PreferredSitesTab(props) {
  const { onTabChange } = props;

  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const dispatch = useDispatch();

  const sitesPerPage = 5;
  const [expand, setExpand] = useState(false);
  const [expandIndex, setExpandIndex] = useState(null);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isArrowToggle, setIsArrowToggle] = useState(false);
  let totalPage = Math.ceil(
    segments[activeSegment.index]?.preferredSites?.length / sitesPerPage,
  );
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const noOfSelectedSites = findNoOfSelectedSites(
    segments[activeSegment.index]?.preferredSites,
    currentPage,
    sitesPerPage,
  );

  const isShowPaginationAndOptions = !!segments[
    activeSegment.index
  ]?.preferredSites.find((ele) => ele.isChecked);

  const handleExpandlink = (index) => {
    setExpand(!expand);
    setExpandIndex(index);
  };
  const toggle = (index) => {
    if (selected === index) {
      setIsArrowToggle(false);
      setSelected(null);
    } else {
      setIsArrowToggle(true);
      setSelected(index);
    }
  };

  const handleCheckAllData = (value) => {
    const newSegments = JSON.parse(JSON.stringify(segments));

    newSegments[activeSegment.index].preferredSites.forEach((ele, index) => {
      if (
        index < currentPage * sitesPerPage &&
        index >= (currentPage - 1) * sitesPerPage
      ) {
        ele.isChecked = value.target.checked;
      }
    });
    setIsCheckedAll(value.target.checked);
    dispatch(setSegments(newSegments));
  };
  const handleDelete = () => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const newData = newSegments[activeSegment.index]?.preferredSites?.filter(
      (ele, index) => {
        if (
          index < currentPage * sitesPerPage &&
          index >= (currentPage - 1) * sitesPerPage
        ) {
          if (!ele.isChecked) {
            return ele;
          }
        } else {
          return ele;
        }
      },
    );

    newSegments[activeSegment.index].preferredSites = newData;

    const { sitesInitiated, sitesContacted } = newSegments[activeSegment.index];

    const preferredSiteIds = newData.map((ele) => ele._id);

    const newSitesInitiated = sitesInitiated?.filter((ele) =>
      preferredSiteIds.includes(ele._id),
    );
    const newSitesContacted = sitesContacted?.filter((ele) =>
      preferredSiteIds.includes(ele._id),
    );
    newSegments[activeSegment.index].sitesInitiated = newSitesInitiated;
    newSegments[activeSegment.index].sitesContacted = newSitesContacted;

    dispatch(setSegments(newSegments));
  };
  const handleChecked = (index) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    newSegments[activeSegment.index].preferredSites[index].isChecked =
      !newSegments[activeSegment.index].preferredSites[index].isChecked;

    dispatch(setSegments(newSegments));
    setIsCheckedAll(true);
  };

  const onClickContactedData = (data) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const contactedSitesIndex = newSegments[
      activeSegment.index
    ]?.sitesContacted.findIndex((ele) => ele._id === data._id);

    if (contactedSitesIndex === -1) {
      newSegments[activeSegment.index]?.sitesContacted?.push(data);
    }

    if (newSegments[activeSegment.index].sitesInitiated.length > 0) {
      const initiatedIndex = newSegments[
        activeSegment.index
      ]?.sitesInitiated.findIndex((ele) => ele._id === data._id);
      if (initiatedIndex !== -1) {
        newSegments[activeSegment.index]?.sitesInitiated.splice(
          initiatedIndex,
          1,
        );
      }
    }
    dispatch(setSegments(newSegments));
  };

  const onClickCheckedContactedData = () => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const checkedData = newSegments[
      activeSegment.index
    ]?.preferredSites?.filter((val) => val.isChecked);
    for (let i = 0; i < checkedData.length; i++) {
      const isAdded = newSegments[activeSegment.index].sitesContacted.filter(
        (val) => val._id === checkedData[i]._id,
      );
      if (isAdded.length === 0) {
        checkedData[i].isChecked = false;
        newSegments[activeSegment.index].sitesContacted.push(checkedData[i]);
      }
    }
    newSegments[activeSegment.index].preferredSites.map(
      (val) => (val.isChecked = false),
    );
    if (newSegments[activeSegment.index].sitesInitiated.length > 0) {
      const checkedDataIds = checkedData?.map((val) => val._id);
      newSegments[activeSegment.index].sitesInitiated = newSegments[
        activeSegment.index
      ]?.sitesInitiated?.filter((elem) => !checkedDataIds.includes(elem._id));
    }

    dispatch(setSegments(newSegments));
  };

  const OnClickInitiatedData = (data) => {
    const newSegments = JSON.parse(JSON.stringify(segments));

    const initiatedSiteIndex = newSegments[
      activeSegment.index
    ]?.sitesInitiated?.findIndex((ele) => ele._id === data._id);

    if (initiatedSiteIndex === -1) {
      newSegments[activeSegment.index]?.sitesInitiated?.push(data);
      dispatch(setSegments(newSegments));
    }

    if (newSegments[activeSegment.index].sitesContacted.length > 0) {
      const updatedSegment = {
        ...newSegments[activeSegment.index],
        sitesContacted: newSegments[activeSegment.index].sitesContacted.filter(
          (elem) => data._id !== elem._id,
        ),
      };
      dispatch(
        setSegments([
          ...newSegments.slice(0, activeSegment.index),
          updatedSegment,
          ...newSegments.slice(activeSegment.index + 1),
        ]),
      );
    }
  };

  const onClickCheckedInitiatedData = () => {
    const newSegments = JSON.parse(JSON.stringify(segments));

    const checkedData = newSegments[
      activeSegment.index
    ]?.preferredSites?.filter((val) => val.isChecked);
    for (let i = 0; i < checkedData.length; i++) {
      const isAdded = newSegments[activeSegment.index].sitesInitiated.filter(
        (val) => val._id === checkedData[i]._id,
      );
      if (isAdded.length === 0) {
        checkedData[i].isChecked = false;
        newSegments[activeSegment.index].sitesInitiated.push(checkedData[i]);
      }
    }
    newSegments[activeSegment.index].preferredSites.map(
      (val) => (val.isChecked = false),
    );

    if (newSegments[activeSegment.index].sitesContacted.length > 0) {
      const checkedDataIds = checkedData?.map((val) => val._id);
      newSegments[activeSegment.index].sitesContacted = newSegments[
        activeSegment.index
      ]?.sitesContacted?.filter((elem) => !checkedDataIds.includes(elem._id));
    }

    dispatch(setSegments(newSegments));
  };

  useEffect(() => {
    let isChecked = false;
    segments[activeSegment.index]?.preferredSites?.forEach((ele, index) => {
      if (
        index < currentPage * sitesPerPage &&
        index >= (currentPage - 1) * sitesPerPage &&
        ele.isChecked
      ) {
        isChecked = true;
      }
    });
    if (isChecked) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
  }, [currentPage, segments]);

  return (
    <>
      {segments[activeSegment.index]?.preferredSites?.length > 0 && (
        <PaginationAndOptions
          tab={'preferredSites'}
          totalPage={totalPage}
          currentPage={currentPage}
          noOfSelectedSites={noOfSelectedSites}
          isCheckedAll={isCheckedAll}
          isShowOptions={isShowPaginationAndOptions}
          setCurrentPage={setCurrentPage}
          handleDelete={handleDelete}
          handleCheckAllData={handleCheckAllData}
          onClickCheckedContactedData={onClickCheckedContactedData}
          onClickCheckedInitiatedData={onClickCheckedInitiatedData}
          onTabChange={onTabChange}
        />
      )}

      {segments[activeSegment.index]?.preferredSites?.map((val, index) => (
        <>
          {index < currentPage * sitesPerPage &&
            index >= (currentPage - 1) * sitesPerPage && (
              <div
                key={val.id}
                className={
                  selected === index
                    ? 'preferred-list-children-dropdown-open'
                    : 'preferred-list-children'
                }
              >
                <div>
                  <Checkbox
                    value={val.isChecked}
                    handleChecked={() => handleChecked(index)}
                    className="handleChecked-checkbox"
                  />
                </div>
                <ConditionContainer
                  className={
                    val.isChecked && !isArrowToggle
                      ? 'selected-condition-container'
                      : val.isChecked && isArrowToggle
                      ? 'condition-container'
                      : 'condition-container'
                  }
                  isActive
                  isVertical
                >
                  <Row className="preferred-list-children-wrapper">
                    <Col>
                      <Row className="preferred-list-children-wrapper-university">
                        {val.name}
                      </Row>
                      &nbsp; &nbsp;
                      {val.isLinked && (
                        <div
                          onClick={() => handleExpandlink(index)}
                          className="preferred-list-children-wrapper-expand"
                        >
                          <Row className="preferred-list-children-wrapper-linked">
                            <Link />
                            {val.noOfLinks === 1
                              ? `${val.noOfLinks} linked site`
                              : `${val.noOfLinks} linked sites`}
                          </Row>
                          {expand &&
                            expandIndex === index &&
                            val?.linkedData?.map((list, idx) => (
                              <Row key={idx}>
                                <div className="preferred-list-children-wrapper-linked-data">
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    {idx + 1}.
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    {list.name}
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    <UserCheck />
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    {list.noOfConnectedSites}
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    <Divider />
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    <UserDelete />
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    {list.noOfNotConnectedSites}
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    <Divider />
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    {list.star}
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    <Star />
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    <Location2 />
                                  </Col>
                                  <Col className="preferred-list-children-wrapper-linked-data-col">
                                    {list.location}
                                  </Col>
                                </div>
                              </Row>
                            ))}
                        </div>
                      )}
                      <Row className="preferred-list-children-wrapper-usersAndLocation">
                        <Col className="preferred-list-children-wrapper-usersAndLocation-col">
                          <UserCheck />
                          {val.connected}
                        </Col>
                        <Divider className="preferred-list-children-wrapper-usersAndLocation-col-icon" />
                        <Col className="preferred-list-children-wrapper-usersAndLocation-col">
                          <UserDelete />
                          {val.not_connected_sites}
                        </Col>
                        <Divider className="preferred-list-children-wrapper-usersAndLocation-col-icon" />
                        <Col className="preferred-list-children-wrapper-usersAndLocation-col">
                          {val.rating}
                          <Star />
                        </Col>
                        <Divider className="preferred-list-children-wrapper-usersAndLocation-col-icon" />
                        <Col className="preferred-list-children-wrapper-usersAndLocation-col">
                          <Location2 />
                          {val.city}
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      xl={{ offset: 8 }}
                      xxl={{ offset: 10 }}
                      className="preferred-list-children-wrapper-info"
                    >
                      <div
                        onClick={() => {
                          onClickContactedData(val);
                          onTabChange('sitesContacted');
                        }}
                        className="sites-contacted-trigger"
                      >
                        <Contact />
                      </div>
                      <div
                        className="sites-initiated-trigger"
                        onClick={() => {
                          OnClickInitiatedData(val);
                          onTabChange('sitesInitiated');
                        }}
                      >
                        <Initiated />
                      </div>
                      <div
                        className="toggles-for-expand"
                        onClick={() => toggle(index)}
                      >
                        {selected === index ? (
                          <DropDownArrowUp className="arrow-up-toggle" />
                        ) : (
                          <Dropdown className="arrow-down-toggle" />
                        )}
                      </div>
                    </Col>
                    <div
                      className={
                        selected === index ? 'content-show' : 'content'
                      }
                    >
                      <SitesInfomationModalContent sitesdetails={val} />
                    </div>
                  </Row>
                </ConditionContainer>
              </div>
            )}
        </>
      ))}
    </>
  );
}

PreferredSitesTab.propTypes = {
  onTabChange: PropTypes.func,
};

PreferredSitesTab.defaultProps = {
  onTabChange: () => {},
};
