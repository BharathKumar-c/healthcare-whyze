import React, { useState } from 'react';
import { Image, Input } from '../../../../components/basic';
import AddIcon from '../../../../assets/AddIcon.svg';
import PropTypes from 'prop-types';
import From from './From';
import AddCondition from '../../../../components/shared/AddCondition';
import { surgeryConditionOptions } from '../../../../constant';
import { surgeryConstants } from '../../../../constant/ConstantTexts';

const Surgery = (props) => {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
  };

  const handleChangeCaseName = (e) => {
    props.handleChangeCaseName(e, props.parentIndex);
    setIsError(false);
  };

  return (
    <div className="indication" id="indication">
      {!props.isChild && (
        <>
          <div className="title-input">
            <Input
              id="main_textbox"
              lable={surgeryConstants.surgeryInputLabel}
              handleInputChange={handleChangeCaseName}
              value={props?.caseDetails?.caseName}
              isError={isError}
              errorText={surgeryConstants.surgeryInputErrorMessage}
            />
          </div>
          <div style={{ height: '30px' }}>
            <Image
              style={{ cursor: 'pointer' }}
              alt="surgery-add-icon"
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
              addConditionOptions={surgeryConditionOptions}
              handleAddCondition={props.handleAddCondition}
              handleChangeCaseName={props.handleChangeCaseName}
              getPopupContainer={'indication'}
              conditionName="surgery"
            />
          ) : c.condition === 'from' ? (
            <From
              totalpatient={c?.count}
              parentIndex={props.parentIndex}
              caseDetails={c}
              isChild={props.isChild}
              parentId={props.caseDetails.id}
              operationValue={c.operation}
              handleAddCondition={props.handleAddCondition}
              handleChangeCaseName={props.handleChangeCaseName}
              getPopupContainer={'indication'}
            />
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
};

Surgery.propTypes = {
  caseDetails: PropTypes.object,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Surgery.defaultProps = {
  caseDetails: null,
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};

export default Surgery;
