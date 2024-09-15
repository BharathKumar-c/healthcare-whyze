import React, { useEffect, useState } from 'react';
import { Image, AutoCompleteComponent } from '../../../../components/basic';
import AddIcon from '../../../../assets/AddIcon.svg';
import PropTypes from 'prop-types';
import {
  AllergiesOptions,
  Allergiesarray,
  autocompleteDefaultLabel,
  autocompleteEmptyLabel,
  Symptomarray,
} from '../../../../constant';

import AddCondition from '../../../../components/shared/AddCondition';
import Reactions from './Reactions';
import useNewFeasibilityStudyService from '../../useNewFeasibilityStudyService';
import { useSelector } from 'react-redux';
import { allergiesConstants } from '../../../../constant/ConstantTexts';

const Allergies = (props) => {
  const [isError, setIsError] = useState(false);
  const [isGetCount, setIsGetCount] = useState(false);
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const { optimusValue } = useNewFeasibilityStudyService();

  const handleError = () => {
    setIsError(true);
  };
  const handleChangeCaseName = (e) => {
    props.handleChangeCaseName(e, props.parentIndex);
    setIsError(false);
  };

  const handleSelectCaseName = (e) => {
    props.handleChangeCaseName(e, props.parentIndex);
    setIsError(false);
    setIsGetCount(true);
  };

  useEffect(() => {
    if (isGetCount) {
      optimusValue({
        name: props?.caseDetails?.name,
        data: segments[activeSegment.index]?.feasibilityStudy,
      });
      setIsGetCount(false);
    }
  }, [isGetCount]);

  return (
    <div className="indication" id="indication">
      {!props?.isChild && (
        <div>
          <AutoCompleteComponent
            options={
              props?.caseDetails?.caseName?.length >= 3
                ? Allergiesarray.length > 0
                  ? Allergiesarray
                  : autocompleteEmptyLabel
                : autocompleteDefaultLabel
            }
            getPopupContainer={() => document.getElementById('indication')}
            value={props?.caseDetails?.caseName}
            placeholder={allergiesConstants.allergiesPlaceholder}
            label={allergiesConstants.allergiesLabel}
            handleSearch={handleChangeCaseName}
            handleSelect={handleSelectCaseName}
            errorText={allergiesConstants.allergiesErrorText}
            isError={isError}
            width={'320px'}
          />
          <div style={{ height: '30px' }}>
            <Image
              style={{ cursor: 'pointer' }}
              preview={false}
              width={12}
              alt="allergies-add-icon"
              height={12}
              src={AddIcon}
              onClick={() =>
                props?.caseDetails?.caseName !== ''
                  ? props.handleAddCondition(props.parentIndex)
                  : handleError()
              }
            />
          </div>
        </div>
      )}

      {props.caseDetails?.child?.map((c, index) => (
        <div
          key={`${index}_${c.condition}_${c.operation}`}
          id="allergies-addcondition"
        >
          {props.isChild ? (
            <div
              className={
                c.condition === '' ? 'vertical-line-condition' : 'vertical-line'
              }
            />
          ) : (
            <div
              style={{
                borderLeft: `2px ${
                  c.condition === '' ? 'dashed' : 'solid'
                } #D3D6D9`,
                height: '32px',
              }}
            />
          )}
          {c.condition === '' ? (
            <AddCondition
              caseDetails={c}
              isChild={props.isChild}
              parentId={props.caseDetails.id}
              parentIndex={props.parentIndex}
              value={c.operation}
              addConditionOptions={AllergiesOptions}
              handleAddCondition={props.handleAddCondition}
              handleChangeCaseName={props.handleChangeCaseName}
              conditionName="allergies"
              getPopupContainer={'allergies-addcondition'}
            />
          ) : c.condition === 'reactions' ? (
            <Reactions
              reactions={Symptomarray}
              caseDetails={c}
              isChild={props.isChild}
              parentIndex={props.parentIndex}
              parentId={props.caseDetails.id}
              operationValue={c.operation}
              totalpatient={c?.count}
              handleAddCondition={props.handleAddCondition}
              handleChangeCaseName={props.handleChangeCaseName}
              getPopupContainer="indication"
            />
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
};

Allergies.propTypes = {
  caseDetails: PropTypes.array,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Allergies.defaultProps = {
  caseDetails: [],
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
export default Allergies;
