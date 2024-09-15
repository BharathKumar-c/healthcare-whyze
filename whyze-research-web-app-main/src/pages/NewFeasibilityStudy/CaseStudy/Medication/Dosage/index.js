import React from 'react';
import PropTypes from 'prop-types';
import { Row, Space, Tag } from 'antd';
import { Vector } from '../../../../../assets';
import {
  CustomSelect,
  Image,
  Input,
  Select,
} from '../../../../../components/basic';
import { ConditionContainer } from '../../../../../components/shared';
import {
  conditionOptions,
  dosageOptions,
  unitOptions,
} from '../../../../../constant';
import DragIcon from '../../../../../assets/DragIcon.svg';
import AddIcon from '../../../../../assets/AddIcon.svg';
import CloseIcon from '../../../../../assets/CloseIcon.svg';
import { useSelector, useDispatch } from 'react-redux';
import {
  addChildInCaseStudy,
  removeChildInCaseStudy,
  updateCaseStudy,
  updateConditionChanges,
} from '../../../../../components/shared/AddCondition';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import { v4 as uuid } from 'uuid';
import Medication from '..';
import { totalPatientFormatter } from '../../../../../utils/calculations';
import { medicationConstants } from '../../../../../constant/ConstantTexts';
import useNewFeasibilityStudyService from '../../../useNewFeasibilityStudyService';

export default function Dosage({
  totalpatient,
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
      study[activeSegment.index]?.feasibilityStudy[parentIndex]?.child,
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

  const handleRemoveCondition = (id) => {
    const study = JSON.parse(JSON.stringify(segments));
    removeChildInCaseStudy(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      parentId,
      id,
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

  const handleSelectDosage = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'dosage',
      {
        level: value,
        dosage: caseDetails?.dosage?.dosage,
        unit: caseDetails?.dosage?.unit,
      },
    );
    optimusValue({
      id: caseDetails.id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });
    dispatch(setSegments(study));
  };

  const handleSelectUnit = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'dosage',
      {
        level: caseDetails?.dosage?.level,
        dosage: caseDetails?.dosage?.dosage,
        unit: value,
      },
    );
    optimusValue({
      id: caseDetails.id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });
    dispatch(setSegments(study));
  };

  const handleInputChangeDosage = (event) => {
    const study = JSON.parse(JSON.stringify(segments));

    updateConditionChanges(
      study[activeSegment.index]?.feasibilityStudy[parentIndex]?.child,
      caseDetails?.id,
      'dosage',
      {
        level: caseDetails?.dosage?.level,
        dosage: event?.target?.value,
        unit: caseDetails?.dosage?.unit,
      },
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
          <div
            className="condition-container-dosage-select"
            id="condition-container-dosage-select"
          >
            <Select
              getPopupContainer={() =>
                document.getElementById('condition-container-dosage-select')
              }
              ariaLabel={'dosage-level'}
              lable={medicationConstants.selectlabel}
              value={caseDetails?.dosage?.level}
              options={dosageOptions}
              handleSelect={handleSelectDosage}
            />
          </div>
          <div className="condition-container-dosage-input">
            <Input
              id="main_textbox"
              lable={medicationConstants.inputLabel}
              type="number"
              name="dosage"
              disabled={isDisableInput}
              handleInputChange={handleInputChangeDosage}
              value={caseDetails?.dosage?.dosage}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div
            className="condition-container-select-unit"
            id="condition-container-select-unit"
          >
            <Select
              getPopupContainer={() =>
                document.getElementById('condition-container-select-unit')
              }
              ariaLabel={'dosage-unit'}
              lable={medicationConstants.inputLabel}
              value={caseDetails?.dosage?.unit}
              options={unitOptions}
              handleSelect={handleSelectUnit}
            />
          </div>
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
          <Tag className="indication-no-patient-tag">
            <Vector />
            {totalPatientFormatter(totalpatient || 0)}
          </Tag>
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

Dosage.propTypes = {
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  totalpatient: PropTypes.number,
  operationValue: PropTypes.string,
  getPopupContainer: PropTypes.string,
  parentId: PropTypes.string,
  caseDetails: PropTypes.object,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};
Dosage.defalutProps = {
  parentIndex: 0,
  isChild: false,
  totalpatient: 0,
  operationValue: '',
  getPopupContainer: '',
  parentId: '',
  caseDetails: null,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
