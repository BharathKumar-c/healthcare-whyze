import React from 'react';
import PropTypes from 'prop-types';
import { Row, Space, Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import Medication from '..';
import { Vector } from '../../../../../assets';
import DragIcon from '../../../../../assets/DragIcon.svg';
import AddIcon from '../../../../../assets/AddIcon.svg';
import CloseIcon from '../../../../../assets/CloseIcon.svg';
import {
  CustomSelect,
  Image,
  Input,
  Select,
  Text,
} from '../../../../../components/basic';
import { ConditionContainer } from '../../../../../components/shared';
import {
  addChildInCaseStudy,
  removeChildInCaseStudy,
  updateCaseStudy,
  updateConditionChanges,
} from '../../../../../components/shared/AddCondition';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import { conditionOptions, periodOptions } from '../../../../../constant';
import { totalPatientFormatter } from '../../../../../utils/calculations';
import { medicationConstants } from '../../../../../constant/ConstantTexts';
import useNewFeasibilityStudyService from '../../../useNewFeasibilityStudyService';

export default function Started({
  totalPatient,
  parentIndex,
  caseDetails,
  isChild,
  parentId,
  operationValue,
  handleAddCondition,
  handleChangeCaseName,
  getPopupContainer,
}) {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const dispatch = useDispatch();
  const { optimusValue, isDisableInput } = useNewFeasibilityStudyService();

  const handleAddNewCondition = (id) => {
    const study = JSON.parse(JSON.stringify(segments));
    addChildInCaseStudy(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      id,
      {
        id: uuid().slice(0, 8),
        condition: '',
        operation: 'And',
        child: [],
      },
    );
    dispatch(setSegments(study));
  };

  const handleSelectRelation = (value, id) => {
    const study = JSON.parse(JSON.stringify(segments));
    const newValue = conditionOptions.find((a) => a.key === value).label;
    updateCaseStudy(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      id,
      'operation',
      newValue,
    );
    optimusValue({
      id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });
    dispatch(setSegments(study));
  };

  const handleRemoveCondition = (id) => {
    const study = JSON.parse(JSON.stringify(segments));
    removeChildInCaseStudy(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      parentId,
      id,
    );
    dispatch(setSegments(study));
  };

  const handleInputValue = (event) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index]?.feasibilityStudy[parentIndex]?.child,
      caseDetails?.id,
      'started',
      {
        value: event?.target?.value,
        period: caseDetails?.started?.period,
      },
    );
    optimusValue({
      id: caseDetails.id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });
    dispatch(setSegments(study));
  };

  const handleSelect = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'started',
      { value: caseDetails?.started?.value, period: value },
    );
    optimusValue({
      id: caseDetails.id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });
    dispatch(setSegments(study));
  };

  return (
    <ConditionContainer
      className={'condition-container'}
      isActive
      isVertical
      isChild={isChild}
    >
      <Space direction="vertical" className="container">
        <div className="container-alignment">
          <div className="drag-drop-image">
            <Image
              alt="drag-icon"
              src={DragIcon}
              width={10}
              height={16}
              preview={false}
            />
          </div>
          <div className="add-image">
            <Image
              className="image"
              alt="add-icon"
              src={AddIcon}
              width={12}
              height={12}
              preview={false}
              onClick={() => handleAddNewCondition(caseDetails.id)}
            />
          </div>
          <div className="condition-container-before-select" />
          <CustomSelect
            className="condition-container-custom-select"
            options={conditionOptions}
            onSelect={(value) => handleSelectRelation(value, caseDetails.id)}
            defaultValue={operationValue}
            getPopupContainer={getPopupContainer}
          />
          <div className="condition-container-after-select" />
          <Text
            className="condition-container-started-sub-text"
            text={medicationConstants.startedPrefixText}
          />
          <div className="condition-container-started-input">
            <Input
              id="main_textbox"
              lable={medicationConstants.inputLabel}
              type="number"
              handleInputChange={handleInputValue}
              value={caseDetails?.started?.value}
              disabled={isDisableInput}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div
            className="condition-container-select-unit"
            id="condition-container-select-unit"
          >
            <Select
              ariaLabel={'started-period'}
              getPopupContainer={() =>
                document.getElementById('condition-container-select-unit')
              }
              lable={medicationConstants.selectlabel}
              options={periodOptions}
              name="period"
              value={caseDetails?.started?.period}
              handleSelect={handleSelect}
            />
          </div>
          <Text className="indication-text-label" text="ago" />
          <div className="close-icon">
            <Image
              src={CloseIcon}
              alt="close-icon"
              className="image"
              width={20}
              height={20}
              preview={false}
              onClick={() => handleRemoveCondition(caseDetails.id, parentId)}
            />
          </div>
        </div>
        <Row className="indication-no-patient-tag-row">
          {totalPatient ? (
            <Tag className="indication-no-patient-tag">
              <Vector />
              {totalPatientFormatter(totalPatient || 0)}
            </Tag>
          ) : null}
        </Row>
      </Space>
      {caseDetails?.child?.length > 0 && (
        <>
          <Medication
            isChild
            parentIndex={parentIndex}
            caseDetails={caseDetails}
            handleAddCondition={handleAddCondition}
            handleChangeCaseName={handleChangeCaseName}
          />
        </>
      )}
    </ConditionContainer>
  );
}

Started.propTypes = {
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  totalPatient: PropTypes.number,
  operationValue: PropTypes.string,
  parentId: PropTypes.string,
  getPopupContainer: PropTypes.string,
  caseDetails: PropTypes.object,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Started.defalutProps = {
  parentIndex: 0,
  isChild: false,
  totalPatient: 0,
  operationValue: '',
  parentId: '',
  getPopupContainer: '',
  caseDetails: null,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
