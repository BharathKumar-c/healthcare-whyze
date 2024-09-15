import React from 'react';
import PropTypes from 'prop-types';
import { Select, Text } from '../../../../components/basic';
import { bmiRangeOptions } from '../../../../constant';
import { ConditionContainer } from '../../../../components/shared';
import { Row, Col, Tag } from 'antd';
import { Drag, Vector } from '../../../../assets';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { totalPatientFormatter } from '../../../../utils/calculations';
import useNewFeasibilityStudyService from '../../useNewFeasibilityStudyService';

const Bmi = (props) => {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const dispatch = useDispatch();
  const { optimusValue } = useNewFeasibilityStudyService();

  const handleSelect = (range) => {
    const study = JSON.parse(JSON.stringify(segments));
    study[activeSegment.index].feasibilityStudy[
      props.parentIndex
    ].child[0].bmiRange = range;

    optimusValue({
      id: props.caseDetails.child[0].id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });

    dispatch(setSegments(study));
  };

  return (
    <div className="bmi_container">
      <ConditionContainer className={'condition-container'} isActive isVertical>
        <Row gutter={{ sm: 32, md: 32, lg: 32 }} className="bmi-wrapper">
          <Col className="bmi_drag-icon">
            <Drag />
          </Col>
          <Col>
            <Text className="bmi-wrapper-title" text="BMI Range" />
          </Col>
          <Col>
            <div
              className="condition-container-select"
              id="condition-container-select"
            >
              <Select
                lable="Select type"
                options={bmiRangeOptions}
                getPopupContainer={() =>
                  document.getElementById('condition-container-select')
                }
                name="range"
                value={props.caseDetails?.child[0]?.bmiRange}
                handleSelect={handleSelect}
              />
            </div>
          </Col>
        </Row>
        <Row className="indication-no-patient-tag-row">
          <Tag className="indication-no-patient-tag">
            <Vector />
            {totalPatientFormatter(props.caseDetails?.child[0]?.count || 0)}
          </Tag>
        </Row>
      </ConditionContainer>
    </div>
  );
};

Bmi.propTypes = {
  caseDetails: PropTypes.object,
  parentIndex: PropTypes.number,
};

Bmi.defaultProps = {
  caseDetails: null,
  parentIndex: 0,
};

export default Bmi;
