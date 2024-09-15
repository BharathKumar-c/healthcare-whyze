import React, { useEffect, useState } from 'react';
import {
  AutoCompleteComponent,
  CustomSelect,
  Text,
} from '../../../../../components/basic';
import { ConditionContainer } from '../../../../../components/shared';
import PropTypes from 'prop-types';
import './Reactions.scss';
import { Image, Row, Space, Tag } from 'antd';
import {
  autocompleteDefaultLabel,
  autocompleteEmptyLabel,
  conditionOptions,
} from '../../../../../constant';
import DragIcon from '../../../../../assets/DragIcon.svg';
import AddIcon from '../../../../../assets/AddIcon.svg';
import CloseIcon from '../../../../../assets/CloseIcon.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import {
  addChildInCaseStudy,
  removeChildInCaseStudy,
  updateCaseStudy,
  updateConditionChanges,
} from '../../../../../components/shared/AddCondition';
import { v4 as uuid } from 'uuid';
import { Vector } from '../../../../../assets';
import Allergies from '..';
import useNewFeasibilityStudyService from '../../../useNewFeasibilityStudyService';
import { totalPatientFormatter } from '../../../../../utils/calculations';

const Reactions = ({
  reactions,
  totalpatient,
  caseDetails,
  parentIndex,
  parentId,
  isChild,
  operationValue,
  handleAddCondition,
  handleChangeCaseName,
  getPopupContainer,
}) => {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const [isGetCount, setIsGetCount] = useState(false);

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
      },
    );
    dispatch(setSegments(study));
  };

  const handleSelectRelation = (value, id) => {
    const study = JSON.parse(JSON.stringify(segments));
    const newValue = conditionOptions.find((a) => a.key === value).label;
    updateCaseStudy(
      study[activeSegment.index]?.feasibilityStudy[parentIndex].child,
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

  const handleChangeSymptom = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'reactions',
      {
        symptom: value,
      },
    );
    dispatch(setSegments(study));
  };

  const handleSelectSymptom = (value) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateConditionChanges(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      caseDetails?.id,
      'reactions',
      {
        symptom: value,
      },
    );
    setIsGetCount(true);

    dispatch(setSegments(study));
  };

  useEffect(() => {
    if (isGetCount) {
      optimusValue({
        id: caseDetails.id,
        data: segments[activeSegment.index]?.feasibilityStudy,
      });
      setIsGetCount(false);
    }
  }, [isGetCount]);

  return (
    <>
      <ConditionContainer
        className={'condition-container'}
        isActive
        isVertical
        isChild={isChild}
      >
        <Space direction="vertical" className="container">
          <div className="container-alignment" id="container-alignment">
            <div className="drag-drop-image">
              <Image src={DragIcon} width={10} height={16} preview={false} />
            </div>
            <div className="add-image">
              <Image
                className="image"
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
            <Text className="indication-text" text="Allergies at least" />
            <AutoCompleteComponent
              options={
                caseDetails?.reactions?.symptom?.length >= 3
                  ? reactions.length > 0
                    ? reactions
                    : autocompleteEmptyLabel
                  : autocompleteDefaultLabel
              }
              getPopupContainer={() =>
                document.getElementById('container-alignment')
              }
              placeholder={'Symptoms / Reaction'}
              label={'Symptoms / Reaction'}
              width={'420px'}
              value={caseDetails?.reactions?.symptom}
              handleSearch={handleChangeSymptom}
              handleSelect={handleSelectSymptom}
            />
            <div className="close-icon">
              <Image
                src={CloseIcon}
                className="image"
                width={20}
                height={20}
                preview={false}
                onClick={() => handleRemoveCondition(caseDetails.id)}
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
          <Allergies
            isChild
            parentIndex={parentIndex}
            caseDetails={caseDetails}
            handleAddCondition={handleAddCondition}
            handleChangeCaseName={handleChangeCaseName}
          />
        )}
      </ConditionContainer>
    </>
  );
};
Reactions.propTypes = {
  reactions: PropTypes.array,
  index: PropTypes.number,
  totalpatient: PropTypes.string,
  caseDetails: PropTypes.object,
  parentId: PropTypes.string,
  operationValue: PropTypes.string,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  getPopupContainer: PropTypes.string,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Reactions.defaultProps = {
  reactions: [],
  index: 0,
  totalpatient: '',
  caseDetails: null,
  parentId: '',
  operationValue: '',
  getPopupContainer: '',
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
export default Reactions;
