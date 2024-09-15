import React from 'react';
import PropTypes from 'prop-types';
import {
  addChildInCaseStudy,
  removeChildInCaseStudy,
  updateCaseStudy,
} from '../../../../../components/shared/AddCondition';
import { conditionOptions, periodOptions } from '../../../../../constant';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Space, Tag } from 'antd';
import { v4 as uuid } from 'uuid';
import { ConditionContainer } from '../../../../../components/shared';
import {
  CustomSelect,
  Image,
  Input,
  Select,
  Text,
} from '../../../../../components/basic';
import { Vector } from '../../../../../assets';
import DragIcon from '../../../../../assets/DragIcon.svg';
import AddIcon from '../../../../../assets/AddIcon.svg';
import CloseIcon from '../../../../../assets/CloseIcon.svg';
import Surgery from '..';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import { updateConditionChanges } from '../../../../../components/shared/AddCondition';
import { totalPatientFormatter } from '../../../../../utils/calculations';

export default function From({
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
    dispatch(setSegments(study));
  };

  const handleInputChangeTimeValue = (event) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'from',
      {
        period: caseDetails?.from?.period,
        value: event?.target?.value,
      },
    );
    dispatch(setSegments(study));
  };

  const handleSelectPeriod = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'from',
      {
        value: caseDetails?.from?.value,
        period: value,
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
            className="condition-container-surgery-sub-text"
            text="Had it"
          />
          <div className="condition-container-surgery-input">
            <Input
              id="main_textbox"
              lable="Enter value"
              name={'value'}
              type="number"
              handleInputChange={handleInputChangeTimeValue}
              value={caseDetails?.from?.value}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div
            className="condition-container-surgery-select"
            id="condition-container-surgery-select"
          >
            <Select
              ariaLabel={'from-period'}
              lable="Select type"
              value={caseDetails?.from?.period}
              getPopupContainer={() =>
                document.getElementById('condition-container-surgery-select')
              }
              options={periodOptions}
              handleSelect={handleSelectPeriod}
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
          <Tag className="indication-no-patient-tag">
            <Vector />
            {totalPatientFormatter(totalpatient || 0)}
          </Tag>
        </Row>
      </Space>
      {caseDetails?.child?.length > 0 && (
        <>
          <Surgery
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

From.propTypes = {
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  totalpatient: PropTypes.number,
  operationValue: PropTypes.string,
  parentId: PropTypes.string,
  getPopupContainer: PropTypes.string,
  caseDetails: PropTypes.object,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

From.defalutProps = {
  parentIndex: 0,
  isChild: false,
  totalpatient: 0,
  operationValue: '',
  parentId: '',
  getPopupContainer: '',
  caseDetails: null,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
