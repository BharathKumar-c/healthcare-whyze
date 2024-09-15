import React from 'react';
import { Row, Col } from 'antd';
import './Demographics.scss';
import PropTypes from 'prop-types';
import { Drag } from '../../../../assets';
import { Vector2 } from '../../../../assets';
import { totalPatientFormatter } from '../../../../utils/calculations';
import { ConditionContainer } from '../../../../components/shared';
import { Gender } from '../../../../constant';
import { Checkbox, Tag, Input } from '../../../../components/basic';
import { useDispatch, useSelector } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { demographicsConst } from '../../../../constant/ConstantTexts';
import useNewFeasibilityStudyService from '../../useNewFeasibilityStudyService';

export default function Demographics({
  currentIndex,
  caseDetails,
  type,
  label,
}) {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const dispatch = useDispatch();
  const { optimusValue, isDisableInput } = useNewFeasibilityStudyService();

  const handleSelectGender = (data) => {
    const study = JSON.parse(JSON.stringify(segments));
    const { value, mainIndex, subIndex } = data;
    const gender =
      study[activeSegment.index]?.feasibilityStudy[mainIndex]?.child[subIndex]
        ?.gender;
    const newGender = gender
      ? gender?.includes(',')
        ? gender?.split(',')
        : [gender]
      : [];
    let edittedGender = [...newGender];
    if (newGender.includes(value.target.name)) {
      edittedGender = newGender.filter((ele) => ele !== value.target.name);
    } else {
      edittedGender.push(value.target.name);
    }
    study[activeSegment.index].feasibilityStudy[mainIndex].child[
      subIndex
    ].gender = edittedGender.join();
    optimusValue({
      data: study[activeSegment.index]?.feasibilityStudy,
      id: study[activeSegment.index].feasibilityStudy[mainIndex].child[subIndex]
        .id,
    });
    dispatch(setSegments(study));
  };

  const handleInputChange = ({ e, mainIndex, subIndex }) => {
    const study = JSON.parse(JSON.stringify(segments));
    study[activeSegment.index].feasibilityStudy[mainIndex].child[
      subIndex
    ].ageRange = {
      ...study[activeSegment.index]?.feasibilityStudy[mainIndex]?.child[
        subIndex
      ]?.ageRange,
      [e.target.name]: e.target.value,
    };
    optimusValue({
      data: study[activeSegment.index]?.feasibilityStudy,
      id: study[activeSegment.index].feasibilityStudy[mainIndex].child[subIndex]
        .id,
    });
    dispatch(setSegments(study));
  };

  return (
    <div className="demographics_container">
      {caseDetails.map((c, index) => (
        <ConditionContainer
          className={'condition-container'}
          key={index}
          isActive
          isVertical
        >
          {c.field === demographicsConst.age && (
            <>
              <Row
                gutter={{ sm: 32, md: 32, lg: 32 }}
                className="demographics_agerange-wrapper"
              >
                <Col
                  className="demographics_agerange-wrapper_drag-icon"
                  md={2}
                  sm={1}
                  lg={1}
                  xl={1}
                >
                  <Drag />
                </Col>
                <Col sm={19} md={17} lg={14} xl={14} xxl={14}>
                  <Row>
                    <Col
                      xl={6}
                      sm={8}
                      md={10}
                      lg={9}
                      xxl={3}
                      className="demographics_agerange-wrapper_Input-box"
                    >
                      <Input
                        type={type}
                        lable={label}
                        width={100}
                        name={demographicsConst.min}
                        value={c?.ageRange?.min}
                        handleInputChange={(e) =>
                          handleInputChange({
                            e,
                            mainIndex: currentIndex,
                            subIndex: index,
                          })
                        }
                        disabled={isDisableInput}
                        onWheel={(e) => e.target.blur()}
                      />
                    </Col>
                    <Col className="demographics_agerange-wrapper_Input-box1">
                      <Input
                        type={type}
                        width={100}
                        name={demographicsConst.max}
                        value={c?.ageRange?.max}
                        handleInputChange={(e) =>
                          handleInputChange({
                            e,
                            mainIndex: currentIndex,
                            subIndex: index,
                          })
                        }
                        disabled={isDisableInput}
                        onWheel={(e) => e.target.blur()}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="demographics_agerange-wrapper_selected-noof-patients">
                <Col>
                  <Tag
                    icon={<Vector2 />}
                    className="demographics_agerange-wrapper_totalpatient-tag"
                  >
                    {totalPatientFormatter(
                      segments[activeSegment.index]?.feasibilityStudy[
                        currentIndex
                      ]?.child[index].count || '0000',
                    )}
                  </Tag>
                </Col>
              </Row>
            </>
          )}

          {c.field === demographicsConst.gender && (
            <>
              <Row>
                <h4>Sex</h4>
              </Row>
              <Row
                gutter={{ sm: 32, md: 32, lg: 32 }}
                className="demographics_gender-wrapper"
              >
                <Col
                  className="demographics_gender-wrapper_drag-icon"
                  md={4}
                  lg={4}
                  xl={2}
                >
                  <Drag />
                </Col>

                <Col
                  sm={19}
                  md={17}
                  lg={14}
                  xl={14}
                  className="demographics_gender-wrapper_checkbox"
                >
                  {Gender.map((ele, i) => (
                    <Checkbox
                      className={
                        c?.gender?.includes(ele.gender)
                          ? 'input-group-active'
                          : 'input-group'
                      }
                      key={i}
                      name={ele.gender}
                      lable={ele.gender}
                      value={c?.gender?.includes(ele.gender)}
                      handleChecked={(value) => {
                        handleSelectGender({
                          value,
                          mainIndex: currentIndex,
                          subIndex: index,
                        });
                      }}
                    />
                  ))}
                </Col>
              </Row>
              <Row className="demographics_gender-wrapper_selected-noof-patients">
                <Col>
                  <Tag
                    icon={<Vector2 />}
                    className="demographics_gender-wrapper_totalpatient-tag"
                  >
                    {totalPatientFormatter(
                      segments[activeSegment.index]?.feasibilityStudy[
                        currentIndex
                      ]?.child[index].count || '0000',
                    )}
                  </Tag>
                </Col>
              </Row>
            </>
          )}
        </ConditionContainer>
      ))}
    </div>
  );
}

Demographics.propTypes = {
  caseDetails: PropTypes.array,
  currentIndex: PropTypes.number,
  type: PropTypes.string,
  label: PropTypes.string,
};
Demographics.defalutProps = {
  caseDetails: [],
  currentIndex: 0,
  type: '',
  label: '',
};
