import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Row, Col } from 'antd';
import { Button } from '../../components/basic';
import CaseStudy from './CaseStudy';
import PatientSegment from './PatientSegment';
import HistoryOfChanges from './HistoryOfChanges';
import './NewFeasibilityStudy.scss';
import AddCriteria from './CaseStudy/Addcriteria';
import { AddIconLarge } from '../../assets';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../redux/reducer/feasibilityStudyReducer';
import FooterNewFeasibilityStudy from './FooterNewFeasibilityStudy';
import Segments from './Segments';
import Location from './Location';
import Sites from './Sites';
import PreferredList from './PreferredList';
import ProposedSiteList from './Sites/ProposedSiteList';
import useHistoryofChangesServices from './HistoryOfChanges/useHistoryofChangesServices';
import { useParams } from 'react-router-dom';
import useDashboard from '../Dashboard/useDashboard';
import { setLoading } from '../../redux/reducer/authReducer';

function NewFeasibilityStudy() {
  const { id } = useParams();
  const { getProjectById } = useDashboard();
  const [open, setOpen] = useState(false);
  const { cardValue, segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const [totalCount, setTotalCount] = useState(0);
  const { optimusValue, allcount } = useHistoryofChangesServices();

  const newTabs = segments && segments[activeSegment?.index]?.tabs;

  const dispatch = useDispatch();

  const addAnotherCondition = () => {
    const caseStudy = JSON.parse(JSON.stringify(segments));
    if (cardValue.case !== 'Condition') {
      caseStudy[activeSegment.index]?.feasibilityStudy.push({
        name: cardValue.case,
        case: cardValue.case,
        condition: cardValue.condition,
        caseName: '',
        child:
          cardValue.case === 'Demographics'
            ? [
                {
                  id: uuid().slice(0, 8),
                  condition: 'Gender',
                  field: 'gender',
                  gender: [],
                },
                {
                  id: uuid().slice(0, 8),
                  condition: 'Age range',
                  field: 'age',
                  ageRange: {
                    min: 0,
                    max: 0,
                  },
                },
              ]
            : cardValue.case === 'Weight'
            ? [
                {
                  id: uuid().slice(0, 8),
                  condition: 'Weight range',
                  field: 'weight',
                  weightRange: {
                    min: 0,
                    max: 0,
                    range: 'kg',
                  },
                },
              ]
            : cardValue.case === 'BMI'
            ? [
                {
                  id: uuid().slice(0, 8),
                  condition: 'Bmi range',
                  bmiRange: 'overWeight',
                },
              ]
            : [],
      });
      dispatch(setSegments(caseStudy));
    }
  };

  const handleSwitchTab = (index) => {
    const data = JSON.parse(JSON.stringify(newTabs));
    let isActiveTabIndex = false;
    for (var i in data) {
      if (Number(i) === index) {
        data[i].isActive = true;
        isActiveTabIndex = true;
      } else {
        data[i].isActive = false;
      }

      if (isActiveTabIndex) {
        data[i].position = 'right';
      } else {
        data[i].position = 'left';
      }
    }
    const newSegments = JSON.parse(JSON.stringify(segments));
    newSegments[activeSegment.index].tabs = data;
    newSegments[activeSegment.index].activeTab = {
      name: data[index].name,
      index,
    };
    dispatch(setSegments(newSegments));
  };

  useEffect(() => {
    if (id) {
      getProjectById(id);
    }
  }, [id]);

  useEffect(() => {
    dispatch(setLoading(true));
    optimusValue();
  }, []);

  useEffect(() => {
    setTotalCount(allcount);
    const newSegments = JSON.parse(JSON.stringify(segments));
    newSegments[activeSegment.index].patientCount = {
      ...newSegments[activeSegment.index].patientCount,
      feasibility: allcount,
    };
    dispatch(setSegments(newSegments));
  }, [allcount]);

  return (
    <>
      <Row id="feasibility_study">
        <Col span={24} className="segment">
          <Segments />
        </Col>
        <div className="feasibility-study-container">
          {newTabs?.length > 0 &&
            newTabs?.map((val, index) => (
              <>
                {!val.isActive && val.position === 'left' && (
                  <div
                    key={index}
                    className="tab-column-grid"
                    onClick={() => handleSwitchTab(index)}
                  >
                    <Col className="tab-column-grid-column-left">
                      <div className="tab-column-grid-title">{val.title}</div>
                    </Col>
                  </div>
                )}
              </>
            ))}
          <div className="feasibility-study-container-box">
            <Col span={newTabs?.length === 1 ? 17 : 16}>
              <Row>
                <Col span={24}>
                  {segments[activeSegment.index]?.activeTab?.name ===
                  'feasibility' ? (
                    <>
                      <CaseStudy />
                      <Col span={24}>
                        <div className="addcritia-btn-grp">
                          <Button
                            handleButtonClick={() => setOpen(true)}
                            icon={<AddIconLarge />}
                            label={'Add criteria'}
                            size={'large'}
                          />
                          {segments[activeSegment.index]?.feasibilityStudy
                            ?.length > 0 && (
                            <Button
                              icon={<AddIconLarge />}
                              label={`Add another ${cardValue.case}`}
                              size={'large'}
                              handleButtonClick={addAnotherCondition}
                            />
                          )}
                        </div>
                      </Col>
                    </>
                  ) : segments[activeSegment.index]?.activeTab?.name ===
                    'location' ? (
                    <Location
                      location={segments[activeSegment.index]?.location}
                    />
                  ) : segments[activeSegment.index]?.activeTab?.name ===
                    'sites' ? (
                    <Sites />
                  ) : (
                    segments[activeSegment.index]?.activeTab?.name ===
                      'preferredList' && <PreferredList />
                  )}
                </Col>
              </Row>
            </Col>

            <Col span={6}>
              <Row>
                <Col span={24} className="patient-segment-container">
                  <PatientSegment
                    totalNoOfPatients={
                      segments[activeSegment.index]?.patientCount
                    }
                    countriesList={
                      segments[activeSegment?.index]?.country &&
                      JSON.parse(
                        JSON.stringify(segments[activeSegment?.index]?.country),
                      )
                    }
                    tab={segments[activeSegment.index]?.activeTab?.name}
                    totalCountry={
                      segments[activeSegment.index]?.country?.length &&
                      JSON.parse(segments[activeSegment.index].country.length)
                    }
                    siteCount={segments[activeSegment.index]?.siteCount}
                  />
                </Col>
                <Col span={24} className="history-of-changes-container">
                  {(segments[activeSegment.index]?.activeTab?.name ===
                    'feasibility' ||
                    segments[activeSegment.index]?.activeTab?.name ===
                      'location') && (
                    <HistoryOfChanges
                      allcount={allcount}
                      isLocation={
                        segments[activeSegment.index]?.activeTab?.name ===
                        'location'
                      }
                      feasibilityStudyCount={totalCount}
                    />
                  )}
                  {segments[activeSegment.index]?.activeTab?.name ===
                    'sites' && <ProposedSiteList />}
                </Col>
              </Row>
            </Col>
          </div>
          {newTabs?.length > 0 &&
            newTabs.map((val, index) => (
              <>
                {!val.isActive && val.position === 'right' && (
                  <div
                    key={index}
                    className="tab-column-grid"
                    onClick={() => handleSwitchTab(index)}
                  >
                    <Col className="tab-column-grid-column-right">
                      <div className="tab-column-grid-title">{val.title}</div>
                    </Col>
                  </div>
                )}
              </>
            ))}
        </div>
        <Col span={24}>
          <FooterNewFeasibilityStudy />
        </Col>
      </Row>
      <AddCriteria isOpen={open} onClose={setOpen} />
    </>
  );
}

export default NewFeasibilityStudy;
