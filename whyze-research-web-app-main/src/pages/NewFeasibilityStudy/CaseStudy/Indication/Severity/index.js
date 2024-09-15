import React from 'react';
import PropTypes from 'prop-types';
import { Row, Space, Tag } from 'antd';
import {
  CustomSelect,
  Image,
  Select,
  Text,
} from '../../../../../components/basic';
import { ConditionContainer } from '../../../../../components/shared';
import {
  conditionOptions,
  severityStageOptions,
} from '../../../../../constant';
import DragIcon from '../../../../../assets/DragIcon.svg';
import AddIcon from '../../../../../assets/AddIcon.svg';
import CloseIcon from '../../../../../assets/CloseIcon.svg';
import { Vector } from '../../../../../assets';
import Indication from '..';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import {
  addChildInCaseStudy,
  removeChildInCaseStudy,
  updateCaseStudy,
  updateConditionChanges,
} from '../../../../../components/shared/AddCondition';
import { v4 as uuid } from 'uuid';
import { totalPatientFormatter } from '../../../../../utils/calculations';
import useNewFeasibilityStudyService from '../../../useNewFeasibilityStudyService';

export default function Severity({
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

  const { optimusValue } = useNewFeasibilityStudyService();

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
        severity: { stage: 'stage 1' },
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

  const handleSelect = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'severity',
      { stage: value },
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
          <Text className="indication-text" text="Severity" />
          <div
            className="condition-container-select"
            id="condition-container-select"
          >
            <Select
              lable="Select type"
              value={caseDetails?.severity?.stage}
              getPopupContainer={() =>
                document.getElementById('condition-container-select')
              }
              ariaLabel="severity-level"
              name="severity"
              options={severityStageOptions}
              handleSelect={handleSelect}
              isShowSearch
            />
          </div>
          <div className="close-icon">
            <Image
              src={CloseIcon}
              className="image"
              width={20}
              height={20}
              preview={false}
              alt="close-icon"
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
          <Indication
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

Severity.propTypes = {
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  totalPatient: PropTypes.string,
  operationValue: PropTypes.string,
  getPopupContainer: PropTypes.string,
  parentId: PropTypes.string,
  caseDetails: PropTypes.object,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Severity.defalutProps = {
  parentIndex: 0,
  isChild: false,
  totalPatient: '',
  operationValue: '',
  parentId: '',
  getPopupContainer: '',
  caseDetails: null,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
