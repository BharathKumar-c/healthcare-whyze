import React, { useState } from 'react';
import { Image, Select } from '../../../../components/basic';
import AddIcon from '../../../../assets/AddIcon.svg';
import PropTypes from 'prop-types';
import Quit from './Quit';
import Started from './Started';
import { nicotineSearchBoxOption } from '../../../../constant';
import { nicotineConstants } from '../../../../constant/ConstantTexts';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { v4 as uuid } from 'uuid';

const Nicotine = (props) => {
  const [isError, setIsError] = useState(false);
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const dispatch = useDispatch();

  const handleChangeCaseName = (e) => {
    const updatedSegments = JSON.parse(JSON.stringify(segments));
    const currentSegment = updatedSegments[activeSegment.index];
    const feasibilityStudy = currentSegment.feasibilityStudy[props.parentIndex];
    feasibilityStudy.caseName = e;

    if (e === 'no') {
      feasibilityStudy.child.pop();
    }

    if (feasibilityStudy.child.length > 0) {
      const condition = e === 'yes' ? 'started' : 'quit';
      const object =
        condition === 'started'
          ? { start: '', to: '' }
          : { startYear: '', quitYear: '' };

      delete feasibilityStudy.child[0][feasibilityStudy.child[0].condition];
      feasibilityStudy.child[0].condition = condition;
      feasibilityStudy.child[0] = {
        ...feasibilityStudy.child[0],
        [condition]: object,
      };
    }

    dispatch(setSegments(updatedSegments));
    setIsError(false);
  };

  const handleAddCondition = (index) => {
    const caseName = props?.caseDetails?.caseName;
    const condition = caseName === 'yes' ? 'started' : 'quit';
    const object =
      condition === 'started'
        ? { start: '', to: '' }
        : { startYear: '', quitYear: '' };
    const updatedSegments = JSON.parse(JSON.stringify(segments));
    const feasibilityStudy =
      updatedSegments[activeSegment.index].feasibilityStudy[index];
    const newChild = { id: uuid().slice(0, 8), condition, [condition]: object };
    feasibilityStudy.child = [...feasibilityStudy.child, newChild];
    dispatch(setSegments(updatedSegments));
  };

  return (
    <div className="indication" id="indication">
      {!props.isChild && (
        <>
          <Select
            id="main_textbox"
            className="nicotine-search-box"
            lable={nicotineConstants.nicotineLabel}
            getPopupContainer={() => document.getElementById('indication')}
            options={nicotineSearchBoxOption}
            handleSelect={handleChangeCaseName}
            value={props?.caseDetails?.caseName}
            isError={isError}
            errorText={nicotineConstants.nicotineConditionErrorMessage}
          />
          {props?.caseDetails?.caseName !== 'no' &&
            props?.caseDetails?.child.length < 1 && (
              <div style={{ height: '30px' }}>
                <Image
                  alt="nicotine-add-icon"
                  style={{ cursor: 'pointer' }}
                  preview={false}
                  width={12}
                  height={12}
                  src={AddIcon}
                  onClick={() =>
                    props.caseDetails.caseName !== ''
                      ? handleAddCondition(props.parentIndex)
                      : setIsError(true)
                  }
                />
              </div>
            )}
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
                data-testid="vertical-line"
                style={{
                  borderLeft: `2px ${
                    c?.condition === '' ? 'dashed' : 'solid'
                  } #D3D6D9`,
                  height: '32px',
                }}
              />
            )}
            {c?.condition === 'quit' &&
              props?.caseDetails?.caseName === 'notAnyMore' && (
                <Quit
                  caseDetails={c}
                  isChild={props.isChild}
                  parentIndex={props.parentIndex}
                  parentId={props.caseDetails.id}
                  totalpatient={c?.count}
                />
              )}
            {c.condition === 'started' &&
              props?.caseDetails?.caseName === 'yes' && (
                <Started
                  caseDetails={c}
                  isChild={props.isChild}
                  parentIndex={props.parentIndex}
                  parentId={props.caseDetails.id}
                  totalpatient={c?.count}
                />
              )}
          </div>
        );
      })}
    </div>
  );
};

Nicotine.propTypes = {
  caseDetails: PropTypes.object,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Nicotine.defaultProps = {
  caseDetails: null,
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
export default Nicotine;
