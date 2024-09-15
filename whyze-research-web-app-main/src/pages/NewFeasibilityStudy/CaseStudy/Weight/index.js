import React, { useState } from 'react';
import { Input, Select } from '../../../../components/basic';
import PropTypes from 'prop-types';
import { ConditionContainer } from '../../../../components/shared';
import { Row, Tag } from 'antd';
import { Drag, Vector } from '../../../../assets';
import './Weight.scss';
import { useDispatch } from 'react-redux';
import useNewFeasibilityStudyService from '../../useNewFeasibilityStudyService';
import { useSelector } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { weightConst } from '../../../../constant/ConstantTexts';
import { weightRange } from '../../../../constant';
import { totalPatientFormatter } from '../../../../utils/calculations';

const Weight = (props) => {
  const [isError, setIsError] = useState(false);
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const dispatch = useDispatch();

  const { optimusValue, isDisableInput } = useNewFeasibilityStudyService();

  const handleInputChange = ({ e, mainIndex, subIndex }) => {
    const study = JSON.parse(JSON.stringify(segments));

    study[activeSegment.index].feasibilityStudy[mainIndex].child[
      subIndex
    ].weightRange = {
      ...study[activeSegment.index]?.feasibilityStudy[mainIndex]?.child[
        subIndex
      ]?.weightRange,
      [e.target.name]: Number(e.target.value),
    };
    setIsError(e.target.value === '');
    dispatch(setSegments(study));
    if (
      study[activeSegment.index].feasibilityStudy[props.parentIndex].child[0]
        .weightRange.range.length > 0
    ) {
      optimusValue({
        id: study[activeSegment.index].feasibilityStudy[mainIndex].child[
          subIndex
        ]?.id,
        data: study[activeSegment.index]?.feasibilityStudy,
      });
    }
  };

  const handleSelect = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    study[activeSegment.index].feasibilityStudy[
      props.parentIndex
    ].child[0].weightRange = {
      ...study[activeSegment.index]?.feasibilityStudy[props.parentIndex]
        ?.child[0]?.weightRange,
      range: value,
    };
    dispatch(setSegments(study));
    optimusValue({
      id: props.caseDetails[0].id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });
  };

  return (
    <div className="weight-container">
      {props.caseDetails.map((c, index) => (
        <ConditionContainer
          className={'condition-container'}
          isActive
          isVertical
          key={index}
        >
          <div className="weight-wrapper">
            <div className="weight-wrapper_dragicon">
              <Drag />
            </div>
            <div className="weight-wrapper_min-inputbox">
              <Input
                lable={weightConst.weightRange}
                type={weightConst.weightType}
                width={100}
                name={weightConst.weightMin}
                value={c?.weightRange?.min === 0 ? '' : c?.weightRange?.min}
                placeholder={weightConst.weightFrom}
                handleInputChange={(e) =>
                  handleInputChange({
                    e,
                    mainIndex: props.parentIndex,
                    subIndex: index,
                    id: c.weightRange.id,
                  })
                }
                disabled={isDisableInput}
                isError={isError}
                errorText={weightConst.weightminErrorText}
                onWheel={(e) => e.target.blur()}
              />
            </div>
            <div className="weight-wrapper_max-inputbox">
              <Input
                type={weightConst.weightType}
                width={100}
                name={weightConst.weightMax}
                value={c?.weightRange?.max === 0 ? '' : c?.weightRange?.max}
                placeholder={weightConst.weightTo}
                handleInputChange={(e) =>
                  handleInputChange({
                    e,
                    mainIndex: props.parentIndex,
                    subIndex: index,
                  })
                }
                disabled={isDisableInput}
                isError={isError}
                errorText={weightConst.weightmaxErrorText}
                onWheel={(e) => e.target.blur()}
              />
            </div>
            <div
              className="weight-wrapper_weight-unit-select"
              id="weight-wrapper_weight-unit-select"
            >
              <Select
                ariaLabel={'weight-unit'}
                options={weightRange}
                handleSelect={handleSelect}
                getPopupContainer={() =>
                  document.getElementById('weight-wrapper_weight-unit-select')
                }
                value={props?.caseDetails[0].weightRange.range}
              />
            </div>
          </div>

          <Row className="indication-no-patient-tag-row">
            <Tag className="indication-no-patient-tag">
              <Vector />
              {totalPatientFormatter(c.count || 0)}
            </Tag>
          </Row>
        </ConditionContainer>
      ))}
    </div>
  );
};

Weight.propTypes = {
  caseDetails: PropTypes.array,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Weight.defaultProps = {
  caseDetails: [],
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
export default Weight;
