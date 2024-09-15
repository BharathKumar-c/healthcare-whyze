import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/hoc';
import { useDispatch, useSelector } from 'react-redux';
import { Space } from 'antd';
import Indication from './Indication';
import {
  setCardDetails,
  setSegments,
} from '../../../redux/reducer/feasibilityStudyReducer';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import Medication from './Medication';
import Nicotine from './Nicotine';
import Symptom from './Symptom';
import Bmi from './Bmi';
import Demographics from './Demographics';
import Allergies from './Allergies';
import Surgery from './Surgery';
import Weight from './Weight';
import NoOfPatient from '../../../components/hoc/card/NoOfPatient';
import { cardBorderColors } from '../../../constant';
import useNewFeasibilityStudyService from '../useNewFeasibilityStudyService';
import { getPatientCount } from '../../../utils/Formatter';

export default function CaseStudy() {
  const dispatch = useDispatch();
  const [renameIndex, setRenameIndex] = useState();
  const { cardValue, segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const { optimusValue } = useNewFeasibilityStudyService();

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty(
      '--card-border-color',
      cardBorderColors[cardValue.case],
    );
  }, [cardValue]);

  const handleAddCondition = (index) => {
    const study = JSON.parse(JSON.stringify(segments));
    study[activeSegment.index].feasibilityStudy[index].child = [
      ...study[activeSegment.index].feasibilityStudy[index].child,
      {
        id: uuid().slice(0, 8),
        condition: '',
        operation: 'And',
        child: [],
      },
    ];
    dispatch(setSegments(study));
  };

  const handleChangeCaseName = (data, index) => {
    const study = JSON.parse(JSON.stringify(segments));
    if (typeof data === 'string') {
      study[activeSegment.index].feasibilityStudy[index].caseName = data;
    } else {
      study[activeSegment.index].feasibilityStudy[index].caseName =
        data?.target?.value;
    }

    dispatch(setSegments(study));
  };

  const handleRename = (name) => {
    let newSegments = JSON.parse(JSON.stringify(segments));
    newSegments[activeSegment.index].feasibilityStudy[renameIndex] = {
      ...newSegments[activeSegment.index].feasibilityStudy[renameIndex],
      name,
    };
    dispatch(setSegments(newSegments));
    setRenameIndex();
  };

  const handleSelectOption = (option, index) => {
    if (option === 'Delete') {
      let newSegments = JSON.parse(JSON.stringify(segments));
      newSegments[activeSegment.index].feasibilityStudy.splice(index, 1);

      const feasibilityStudy =
        newSegments[activeSegment.index].feasibilityStudy;
      const cardDetails = {
        case: 'Condition',
        condition: '',
        index: null,
      };

      if (index > 0 && feasibilityStudy[index - 1]) {
        cardDetails.case = feasibilityStudy[index - 1].case;
        cardDetails.condition = feasibilityStudy[index - 1].condition;
        cardDetails.index = index - 1;
      } else if (feasibilityStudy[index]) {
        cardDetails.case = feasibilityStudy[index].case;
        cardDetails.condition = feasibilityStudy[index].condition;
        cardDetails.index = index;
      }
      setRenameIndex();
      dispatch(setCardDetails(cardDetails));
      dispatch(setSegments(newSegments));

      optimusValue({
        name: cardDetails.index !== null ? feasibilityStudy[index]?.name : '',
        data: newSegments[activeSegment.index].feasibilityStudy,
      });
    }

    if (option === 'Duplicate') {
      const newSegments = JSON.parse(JSON.stringify(segments));
      newSegments[activeSegment.index].feasibilityStudy = [
        ...newSegments[activeSegment.index].feasibilityStudy,
        segments[activeSegment.index].feasibilityStudy[index],
      ];
      dispatch(setSegments(newSegments));
      setRenameIndex();
    }

    if (option === 'Rename') {
      setRenameIndex(index);
    }
  };

  const handleClickCard = (index, caseDetails) => {
    dispatch(
      setCardDetails({
        index: index,
        case: caseDetails.case,
        condition: caseDetails.condition,
      }),
    );
  };

  return (
    <div id="casestudy-container">
      {segments[activeSegment.index]?.feasibilityStudy?.map(
        (caseDetails, index) => {
          return (
            <Card
              key={`${index}_${caseDetails.case}`}
              index={index}
              isRename={index === renameIndex}
              title={{ case: caseDetails.case, name: caseDetails.name }}
              tagtitle={caseDetails.condition}
              handleActionClick={() =>
                index === cardValue.index
                  ? null
                  : handleClickCard(index, caseDetails)
              }
              handleSelectOption={handleSelectOption}
              className={
                cardValue.index === index ? 'card-head' : 'inActive-card-head'
              }
              handleRename={handleRename}
              extra={
                <NoOfPatient
                  totalpatient={getPatientCount(caseDetails)}
                  handleSelectOption={(option) =>
                    handleSelectOption(option, index)
                  }
                  getPopupContainer={'casestudy-container'}
                />
              }
            >
              <Space direction="vertical" className="case-study-container">
                {caseDetails.case === 'Demographics' && (
                  <Demographics
                    currentIndex={index}
                    caseDetails={caseDetails.child}
                    type={'number'}
                    label={'Age range'}
                  />
                )}
                {caseDetails.case === 'Indication' && (
                  <Indication
                    parentIndex={index}
                    caseDetails={caseDetails}
                    handleAddCondition={handleAddCondition}
                    handleChangeCaseName={handleChangeCaseName}
                  />
                )}

                {caseDetails.case === 'Medication' && (
                  <Medication
                    parentIndex={index}
                    caseDetails={caseDetails}
                    handleAddCondition={handleAddCondition}
                    handleChangeCaseName={handleChangeCaseName}
                  />
                )}
                {caseDetails.case === 'Nicotine' && (
                  <Nicotine
                    parentIndex={index}
                    caseDetails={caseDetails}
                    handleAddCondition={handleAddCondition}
                    handleChangeCaseName={handleChangeCaseName}
                  />
                )}
                {caseDetails.case === 'BMI' && (
                  <Bmi parentIndex={index} caseDetails={caseDetails} />
                )}
                {caseDetails.case === 'Symptom' && <Symptom />}
                {caseDetails.case === 'Allergies' && (
                  <Allergies
                    parentIndex={index}
                    caseDetails={caseDetails}
                    handleAddCondition={handleAddCondition}
                    handleChangeCaseName={handleChangeCaseName}
                  />
                )}

                {caseDetails.case === 'Weight' && (
                  <Weight
                    parentIndex={index}
                    caseDetails={caseDetails.child}
                    handleAddCondition={handleAddCondition}
                    handleChangeCaseName={handleChangeCaseName}
                  />
                )}

                {caseDetails.case === 'Surgery' && (
                  <Surgery
                    parentIndex={index}
                    caseDetails={caseDetails}
                    handleAddCondition={handleAddCondition}
                    handleChangeCaseName={handleChangeCaseName}
                  />
                )}
              </Space>
            </Card>
          );
        },
      )}
    </div>
  );
}

CaseStudy.propTypes = {
  handleCaseData: PropTypes.func,
};

CaseStudy.defaultProps = {
  handleCaseData: () => {},
};
