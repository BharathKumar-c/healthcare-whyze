import React, { useEffect, useState } from 'react';
import AddCondition from '../../../../components/shared/AddCondition';
import Diagnosed from './Diagnosed';
import Recovered from './Recovered';
import Severity from './Severity';
import { AutoCompleteComponent, Image } from '../../../../components/basic';
import AddIcon from '../../../../assets/AddIcon.svg';
import PropTypes from 'prop-types';
import {
  autocompleteDefaultLabel,
  autocompleteEmptyLabel,
  medicalConditionOptions,
} from '../../../../constant';
import useIndication from './useIndicationService';
import {
  conditions,
  indicationConstants,
} from '../../../../constant/ConstantTexts';
import { useSelector } from 'react-redux';
import useNewFeasibilityStudyService from '../../useNewFeasibilityStudyService';

const Indication = (props) => {
  const [isError, setIsError] = useState(false);
  const [isGetCount, setIsGetCount] = useState(false);
  const { condition, getMedicalCondition } = useIndication();
  const { optimusValue } = useNewFeasibilityStudyService();
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const handleError = () => {
    setIsError(true);
  };
  const handleSearch = (e) => {
    if (e.length >= 3) {
      getMedicalCondition(e);
    }
    props.handleChangeCaseName(e, props.parentIndex);
    setIsError(false);
  };

  const handleSelect = (e) => {
    props.handleChangeCaseName(e, props.parentIndex);
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
      {!props.isChild && (
        <>
          <AutoCompleteComponent
            id="main_textbox"
            options={
              props?.caseDetails?.caseName?.length >= 3
                ? condition.length > 0
                  ? condition
                  : autocompleteEmptyLabel
                : autocompleteDefaultLabel
            }
            label={indicationConstants.medicalConditionLabel}
            getPopupContainer={() => document.getElementById('indication')}
            placeholder={indicationConstants.medicalConditionLabel}
            handleSearch={handleSearch}
            handleSelect={handleSelect}
            value={props?.caseDetails?.caseName}
            width={'320px'}
            isError={isError}
            errorText={indicationConstants.medicalConditionErrorMessage}
          />
          <div style={{ height: '30px' }}>
            <Image
              style={{ cursor: 'pointer' }}
              preview={false}
              width={12}
              alt="Indication-add-icon"
              height={12}
              src={AddIcon}
              onClick={() =>
                props.caseDetails.caseName !== ''
                  ? props.handleAddCondition(props.parentIndex)
                  : handleError()
              }
            />
          </div>
        </>
      )}
      {props.caseDetails?.child?.map((c, index) => {
        return (
          <div key={`${index}_${c.condition}_${c.operation}`}>
            {props.isChild ? (
              <div
                className={
                  c?.condition === ''
                    ? 'vertical-line-condition'
                    : 'vertical-line'
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
                addConditionOptions={medicalConditionOptions}
                handleAddCondition={props.handleAddCondition}
                handleChangeCaseName={props.handleChangeCaseName}
                conditionName="condition"
                getPopupContainer={'indication'}
              />
            ) : c.condition === conditions.diagnosed ? (
              <Diagnosed
                caseDetails={c}
                isChild={props.isChild}
                parentIndex={props.parentIndex}
                parentId={props.caseDetails.id}
                operationValue={c.operation}
                totalpatient={c?.count}
                handleAddCondition={props.handleAddCondition}
                handleChangeCaseName={props.handleChangeCaseName}
                getPopupContainer={'indication'}
              />
            ) : c.condition === conditions.recovered ? (
              <Recovered
                caseDetails={c}
                isChild={props.isChild}
                parentIndex={props.parentIndex}
                parentId={props.caseDetails.id}
                operationValue={c.operation}
                totalPatient={c?.count}
                handleAddCondition={props.handleAddCondition}
                handleChangeCaseName={props.handleChangeCaseName}
                getPopupContainer={'indication'}
              />
            ) : c.condition === conditions.severity ? (
              <Severity
                caseDetails={c}
                isChild={props.isChild}
                parentIndex={props.parentIndex}
                operationValue={c.operation}
                totalPatient={c?.count}
                parentId={props.caseDetails.id}
                handleAddCondition={props.handleAddCondition}
                handleChangeCaseName={props.handleChangeCaseName}
                getPopupContainer={'indication'}
              />
            ) : (
              ''
            )}{' '}
          </div>
        );
      })}
    </div>
  );
};

Indication.propTypes = {
  caseDetails: PropTypes.object,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Indication.defaultProps = {
  caseDetails: null,
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};

export default Indication;
