import React from 'react';
import PropTypes from 'prop-types';
import { Row, Space, Tag } from 'antd';
import {
  CustomSelect,
  Image,
  Input,
  Select,
  Text,
} from '../../../../../components/basic';
import { ConditionContainer } from '../../../../../components/shared';
import { conditionOptions, periodOptions } from '../../../../../constant';
import DragIcon from '../../../../../assets/DragIcon.svg';
import AddIcon from '../../../../../assets/AddIcon.svg';
import CloseIcon from '../../../../../assets/CloseIcon.svg';
import { Vector } from '../../../../../assets';
import Indication from '..';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChildInCaseStudy,
  removeChildInCaseStudy,
  updateCaseStudy,
  updateConditionChanges,
} from '../../../../../components/shared/AddCondition';
import { v4 as uuid } from 'uuid';
import { totalPatientFormatter } from '../../../../../utils/calculations';
import useNewFeasibilityStudyService from '../../../useNewFeasibilityStudyService';

export default function Diagnosed({
  totalpatient,
  caseDetails,
  parentIndex,
  parentId,
  isChild,
  operationValue,
  handleAddCondition,
  handleChangeCaseName,
  getPopupContainer,
}) {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const { optimusValue, isDisableInput } = useNewFeasibilityStudyService();

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

  const handleInputChange = (event) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'diagnosed',
      {
        period: caseDetails?.diagnosed?.period,
        value: event?.target?.value,
      },
    );
    optimusValue({
      id: caseDetails?.id,
      data: study[activeSegment.index]?.feasibilityStudy,
    });
    dispatch(setSegments(study));
  };

  const handleSelect = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'diagnosed',
      { value: caseDetails?.diagnosed?.value, period: value },
    );
    optimusValue({
      id: caseDetails?.id,
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
              src={DragIcon}
              width={10}
              height={16}
              preview={false}
              alt="drag-icon"
            />
          </div>
          <div className="add-image">
            <Image
              className="image"
              src={AddIcon}
              alt="add-icon"
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
          <Text className="indication-text" text="Diagnosed at least" />
          <div className="condition-container-input">
            <Input
              type="number"
              lable="Enter value"
              name="diagnosed"
              value={caseDetails?.diagnosed?.value}
              handleInputChange={handleInputChange}
              disabled={isDisableInput}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div
            className="condition-container-select"
            id="condition-container-select"
          >
            <Select
              lable="Select type"
              ariaLabel="diagnosed-level"
              options={periodOptions}
              name="period"
              getPopupContainer={() =>
                document.getElementById('condition-container-select')
              }
              value={caseDetails?.diagnosed?.period}
              handleSelect={handleSelect}
            />
          </div>
          <Text className="indication-text-label" text="ago" />
          <div className="close-icon">
            <Image
              src={CloseIcon}
              className="image"
              alt="close-icon"
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
        <Indication
          isChild
          parentIndex={parentIndex}
          caseDetails={caseDetails}
          handleAddCondition={handleAddCondition}
          handleChangeCaseName={handleChangeCaseName}
        />
      )}
    </ConditionContainer>
  );
}

Diagnosed.propTypes = {
  totalpatient: PropTypes.string,
  caseDetails: PropTypes.object,
  parentId: PropTypes.string,
  getPopupContainer: PropTypes.string,
  operationValue: PropTypes.string,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Diagnosed.defalutProps = {
  totalpatient: '',
  operationValue: '',
  parentId: '',
  getPopupContainer: '',
  parentIndex: 0,
  isChild: false,
  caseDetails: null,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
