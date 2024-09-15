import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutoCompleteComponent, Image } from '../../../../components/basic';
import AddIcon from '../../../../assets/AddIcon.svg';
import AddCondition from '../../../../components/shared/AddCondition';
import {
  autocompleteEmptyLabel,
  autocompleteDefaultLabel,
  medicationConditionOptions,
} from '../../../../constant';
import Started from './Started';
import Dosage from './Dosage';
import CourseOfTherapy from './CourseOfTherapy';
import {
  conditions,
  medicationConstants,
} from '../../../../constant/ConstantTexts';
import useMedication from './useMedicationServices';
import { useSelector } from 'react-redux';
import useNewFeasibilityStudyService from '../../useNewFeasibilityStudyService';

export default function Medication(props) {
  const [isError, setIsError] = useState(false);
  const [isGetCount, setIsGetCount] = useState(false);
  const { getMedicationCondition, condition } = useMedication();
  const { optimusValue } = useNewFeasibilityStudyService();

  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const handleError = () => {
    setIsError(true);
  };

  const handleSearch = (e) => {
    if (e.length >= 3) {
      getMedicationCondition(e);
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
    <div className="medication" id="medication">
      {!props.isChild && (
        <>
          <div className="title-input">
            <AutoCompleteComponent
              options={
                props?.caseDetails?.caseName?.length >= 3
                  ? condition.length > 0
                    ? condition
                    : autocompleteEmptyLabel
                  : autocompleteDefaultLabel
              }
              getPopupContainer={() => document.getElementById('medication')}
              placeholder={medicationConstants.medicationLabel}
              label={medicationConstants.medicationLabel}
              handleSearch={handleSearch}
              handleSelect={handleSelect}
              value={props?.caseDetails?.caseName}
              width={'320px'}
              isError={isError}
              errorText={medicationConstants.medicationErrorMessage}
            />
          </div>

          <div style={{ height: '30px' }}>
            <Image
              style={{ cursor: 'pointer' }}
              alt="medication-add-icon"
              preview={false}
              width={12}
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
      {props.caseDetails?.child?.map((c, index) => (
        <div key={`${index}_${c.condition}_${c.operation}`}>
          {props.isChild ? (
            <div
              className={
                c.condition === '' ? 'vertical-line-condition' : 'vertical-line'
              }
            />
          ) : (
            <div
              data-testid="vertical-line"
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
              addConditionOptions={medicationConditionOptions}
              handleAddCondition={props.handleAddCondition}
              handleChangeCaseName={props.handleChangeCaseName}
              conditionName="Medication"
              getPopupContainer={'medication'}
            />
          ) : c.condition === conditions.started ? (
            <Started
              caseDetails={c}
              isChild={props.isChild}
              parentIndex={props.parentIndex}
              parentId={props.caseDetails.id}
              operationValue={c.operation}
              totalPatient={c?.count}
              handleAddCondition={props.handleAddCondition}
              handleChangeCaseName={props.handleChangeCaseName}
              conditionName="Medication"
              getPopupContainer={'medication'}
            />
          ) : c.condition === conditions.dosage ? (
            <Dosage
              caseDetails={c}
              isChild={props.isChild}
              parentIndex={props.parentIndex}
              parentId={props.caseDetails.id}
              operationValue={c.operation}
              totalpatient={c?.count}
              handleAddCondition={props.handleAddCondition}
              handleChangeCaseName={props.handleChangeCaseName}
              conditionName="Medication"
              getPopupContainer={'medication'}
            />
          ) : c.condition === conditions.courseOfTherapy ? (
            <CourseOfTherapy />
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
}

Medication.propTypes = {
  caseDetails: PropTypes.object,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Medication.defaultProps = {
  caseDetails: {},
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
