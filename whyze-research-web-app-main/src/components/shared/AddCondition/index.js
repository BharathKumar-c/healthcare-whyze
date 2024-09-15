import React from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';
import DragIcon from '../../../assets/DragIcon.svg';
import AddIcon from '../../../assets/AddIcon.svg';
import CloseIcon from '../../../assets/CloseIcon.svg';
import { CustomSelect, DropDown, Image } from '../../basic';
import { conditionOptions } from '../../../constant';
import { ConditionContainer } from '..';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { setSegments } from '../../../redux/reducer/feasibilityStudyReducer';
import Indication from '../../../pages/NewFeasibilityStudy/CaseStudy/Indication';
import './AddCondition.scss';

export function addChildInCaseStudy(array, id, value) {
  array.forEach((obj) => {
    if (obj.id === id) {
      obj.child.push(value);
    }
    if (obj.child) {
      addChildInCaseStudy(obj.child, id, value);
    }
  });
}

export function removeChildInCaseStudy(array, parentId, id) {
  if (!parentId) {
    const index = array.findIndex((ele) => ele.id === id);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
  array.forEach((obj) => {
    if (obj.id === parentId) {
      const index = obj.child.findIndex((ele) => ele.id === id);
      obj.child.splice(index, 1);
    }
    if (obj.child) {
      removeChildInCaseStudy(obj.child, parentId, id);
    }
  });
}

export function updateCaseStudy(array, id, key, value, defaultValue) {
  array.forEach((obj) => {
    if (obj.id === id) {
      if (key === 'condition') {
        obj[value] = defaultValue;
      }
      obj[key] = value;
    }
    if (obj.child) {
      updateCaseStudy(obj.child, id, key, value, defaultValue);
    }
  });
}

export function updateConditionChanges(array, id, key, value) {
  array.forEach((obj) => {
    if (obj.id === id) {
      obj[key] = value;
    }
    if (obj.child) {
      updateCaseStudy(obj.child, id, key, value);
    }
  });
}

const AddCondition = ({
  isChild,
  value,
  parentIndex,
  parentId,
  caseDetails,
  addConditionOptions,
  handleAddCondition,
  handleChangeCaseName,
  conditionName,
  getPopupContainer,
}) => {
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
      study[activeSegment.index]?.feasibilityStudy[parentIndex].child,
      id,
      'operation',
      newValue,
    );
    dispatch(setSegments(study));
  };

  const handleSelectCondition = (value, id, defaultValue) => {
    const study = JSON.parse(JSON.stringify(segments));
    updateCaseStudy(
      study[activeSegment.index]?.feasibilityStudy[parentIndex].child,
      id,
      'condition',
      value,
      defaultValue,
    );
    dispatch(setSegments(study));
  };

  return (
    <ConditionContainer
      className={'condition-container'}
      isVertical
      isActive={caseDetails.condition !== ''}
      isChild={isChild}
    >
      <Space direction="vertical" className="container">
        <div className="container-alignment">
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
              onClick={() =>
                caseDetails.condition !== ''
                  ? handleAddNewCondition(caseDetails.id)
                  : null
              }
            />
          </div>
          <div className="dashed-line-before-select" />
          <CustomSelect
            className="custom-select"
            options={conditionOptions}
            onSelect={(value) => handleSelectRelation(value, caseDetails.id)}
            defaultValue={value}
            getPopupContainer={getPopupContainer}
          />
          <div className="dashed-line-before-button" />
          <DropDown
            items={addConditionOptions}
            onChange={(value) =>
              handleSelectCondition(value.key, caseDetails.id)
            }
            getPopupContainer={() => document.getElementById(getPopupContainer)}
          >
            <div className="indication-add-button">
              {`+ Add other ${conditionName} details`}
            </div>
          </DropDown>
          <div className="close-icon">
            <Image
              src={CloseIcon}
              className="image"
              width={20}
              height={20}
              preview={false}
              onClick={() => handleRemoveCondition(caseDetails.id, parentId)}
            />
          </div>
        </div>
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
};

AddCondition.propTypes = {
  isChild: PropTypes.bool,
  value: PropTypes.string,
  parentId: PropTypes.string,
  conditionName: PropTypes.string,
  getPopupContainer: PropTypes.string,
  parentIndex: PropTypes.number,
  caseDetails: PropTypes.object,
  addConditionOptions: PropTypes.array,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

AddCondition.defalutProps = {
  isChild: false,
  value: '',
  parentId: '',
  conditionName: '',
  getPopupContainer: '',
  parentIndex: 0,
  caseDetails: null,
  addConditionOptions: [],
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};

export default AddCondition;
