import React, { useEffect, useState } from 'react';
import './../preferredList.scss';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { ConditionContainer } from '../../../../components/shared';
import {
  DropDownArrowUp,
  Contact,
  Divider,
  Dropdown,
  Initiated,
  Link,
  Location2,
  Star,
  UserCheck,
  UserDelete,
} from '../../../../assets';
import PaginationAndOptions from '../PaginationAndOptions';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { Checkbox } from '../../../../components/basic';
import SitesInfomationModalContent from '../../Sites/SitesInformationModal/SitesinfomationModalContent';
import { dateFormatter } from '../../../../utils/calculations';

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

export default function SitesInitiatedTab(props) {
  const { onTabChange } = props;
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const dispatch = useDispatch();
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [expand, setExpand] = useState(false);
  const [expandIndex, setExpandIndex] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isArrowToggle, setIsArrowToggle] = useState(false);
  const sitesPerPage = 5;
  let totalPage = Math.ceil(
    segments[activeSegment.index]?.sitesInitiated?.length / sitesPerPage,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const noOfSelectedSites = findNoOfSelectedSites(
    segments[activeSegment.index]?.sitesInitiated,
    currentPage,
    sitesPerPage,
  );
  const toggle = (index) => {
    if (selected === index) {
      setIsArrowToggle(false);
      setSelected(null);
    } else {
      setIsArrowToggle(true);
      setSelected(index);
    }
  };
  const isShowPaginationAndOptions = !!segments[
    activeSegment.index
  ]?.sitesInitiated.find((ele) => ele.isChecked);

  const handleCheckAllData = (value) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    newSegments[activeSegment.index].sitesInitiated.forEach((ele, index) => {
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

  const handleChecked = (index) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    newSegments[activeSegment.index].sitesInitiated[index].isChecked =
      !newSegments[activeSegment.index].sitesInitiated[index].isChecked;
    dispatch(setSegments(newSegments));
    setIsCheckedAll(true);
  };

  const onClickInitiatedData = (data) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const spliceData = newSegments[activeSegment.index]?.sitesInitiated.filter(
      (val) => val._id !== data._id,
    );
    newSegments[activeSegment.index].sitesInitiated = spliceData;
    dispatch(setSegments(newSegments));
  };

  const onClickContactedData = (data) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const checkData = newSegments[activeSegment.index].sitesContacted.filter(
      (val) => val._id === data._id,
    );
    if (checkData.length === 0) {
      newSegments[activeSegment.index]?.sitesContacted?.push(data);
    }
    const spliceData = newSegments[activeSegment.index]?.sitesInitiated.filter(
      (val) => val._id !== data._id,
    );
    newSegments[activeSegment.index].sitesInitiated = spliceData;
    dispatch(setSegments(newSegments));
  };

  const onClickCheckedPreferredSitesData = () => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const spliceData = newSegments[activeSegment.index]?.sitesInitiated.filter(
      (val) => !val.isChecked,
    );
    newSegments[activeSegment.index].sitesInitiated = spliceData;
    dispatch(setSegments(newSegments));
  };

  const onClickCheckedContactedData = () => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const checkedData = newSegments[
      activeSegment.index
    ]?.sitesInitiated?.filter((val) => val.isChecked);
    const spliceData = newSegments[activeSegment.index]?.sitesInitiated.filter(
      (val) => !val.isChecked,
    );
    for (let i = 0; i < checkedData.length; i++) {
      const isAdded = newSegments[activeSegment.index].sitesContacted.filter(
        (val) => val._id === checkedData[i]._id,
      );
      if (isAdded.length === 0) {
        checkedData[i].isChecked = false;
        newSegments[activeSegment.index].sitesContacted.push(checkedData[i]);
      }
    }
    newSegments[activeSegment.index].sitesInitiated = spliceData;
    dispatch(setSegments(newSegments));
  };

  const handleExpandlink = (index) => {
    setExpand(!expand);
    setExpandIndex(index);
  };

  const handleDelete = () => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    const newData = newSegments[activeSegment.index]?.sitesInitiated?.filter(
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

    newSegments[activeSegment.index].sitesInitiated = newData;

    dispatch(setSegments(newSegments));
  };

  useEffect(() => {
    let isChecked = false;
    segments[activeSegment.index]?.sitesInitiated?.forEach((ele, index) => {
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

  useEffect(() => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    if (newSegments[activeSegment.index]?.sitesInitiated?.length > 0) {
      const sitesId =
        newSegments?.[activeSegment.index]?.sites?.map((ele) => ele._id) ?? [];
      newSegments[activeSegment.index].sitesInitiated = newSegments[
        activeSegment.index
      ]?.sitesInitiated?.filter((elem) => sitesId.includes(elem._id));
      dispatch(setSegments(newSegments));
    }
  }, []);

  return (
    <>
      {segments[activeSegment.index]?.sitesInitiated.length > 0 && (
        <PaginationAndOptions
          tab={'initiated'}
          totalPage={totalPage}
          currentPage={currentPage}
          noOfSelectedSites={noOfSelectedSites}
          isCheckedAll={isCheckedAll}
          isShowOptions={isShowPaginationAndOptions}
          setCurrentPage={setCurrentPage}
          handleDelete={handleDelete}
          handleCheckAllData={handleCheckAllData}
          onClickCheckedPreferredSitesData={onClickCheckedPreferredSitesData}
          onClickCheckedContactedData={onClickCheckedContactedData}
          onTabChange={onTabChange}
        />
      )}
      {segments[activeSegment.index]?.sitesInitiated.length > 0 ? (
        segments[activeSegment.index]?.sitesInitiated.map((val, index) => (
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
                  <Col md={1}>
                    <Checkbox
                      value={val.isChecked}
                      handleChecked={() => handleChecked(index)}
                      className="handleChecked-checkbox"
                    />
                  </Col>
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
                            onClickInitiatedData(val);
                            onTabChange('preferredSites');
                          }}
                        >
                          <Initiated className="preferred-list-children-wrapper-info-active-icon" />
                        </div>
                        <div className="preferred-list-children-wrapper-info-date">
                          {dateFormatter('dd/MM/yyyy')}
                        </div>
                        <div onClick={() => toggle(index)}>
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
        ))
      ) : (
        <div className="preferred-list-empty-children">
          <div>Sites that have been indicated for</div>
          <div>being enrolled will display here.</div>
        </div>
      )}
    </>
  );
}

SitesInitiatedTab.propTypes = {
  onTabChange: PropTypes.func,
};

SitesInitiatedTab.defaultProps = {
  onTabChange: () => {},
};
