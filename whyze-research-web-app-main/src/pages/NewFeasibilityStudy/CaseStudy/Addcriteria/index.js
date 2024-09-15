import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Card } from 'antd';
import { Segaments } from '../../../../components/basic';
import { Modal } from '../../../../components/hoc';
import { IconList } from '../../../../constant/IconData';
import './AddCriteria.scss';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCardDetails,
  setSegments,
} from '../../../../redux/reducer/feasibilityStudyReducer';
import {
  addCriteriaTitle,
  cancelButtonLabel,
  saveButtonLabel,
} from '../../../../constant/ConstantTexts';

export default function AddCriteria(props) {
  const [titles, setTitles] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [segmentoption, setSegmentOption] = useState('Inclusion');
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const dispatch = useDispatch();

  const Titles = (ele) => {
    const newTitleChange = [...titles];
    const findIndex = newTitleChange?.findIndex(
      (element) => element === ele.Title,
    );

    if (findIndex > -1) {
      newTitleChange?.splice(findIndex, 1);
    } else {
      newTitleChange?.push(ele.Title);
    }
    setTitles(newTitleChange);
  };

  const SaveConditions = (titles) => {
    setIsLoading(true);
    const caseStudy = JSON.parse(JSON.stringify(segments));
    titles.map((elem) => {
      caseStudy[activeSegment.index].feasibilityStudy.push({
        name: elem,
        case: elem,
        condition: segmentoption,
        caseName: '',
        child:
          elem === 'Demographics'
            ? [
                {
                  id: uuid().slice(0, 8),
                  condition: 'Gender',
                  field: 'gender',
                  gender: '',
                },
                {
                  id: uuid().slice(0, 8),
                  condition: 'Age range',
                  field: 'age',
                  ageRange: {
                    min: 0,
                    max: 0,
                  },
                },
              ]
            : elem === 'Weight'
            ? [
                {
                  id: uuid().slice(0, 8),
                  condition: 'Weight range',
                  field: 'weight',
                  weightRange: {
                    min: 0,
                    max: 0,
                    range: '',
                  },
                },
              ]
            : elem === 'BMI'
            ? [
                {
                  id: uuid().slice(0, 8),
                  condition: 'Bmi range',
                  bmiRange: '',
                },
              ]
            : [],
      });
    });

    dispatch(
      setCardDetails({
        index: caseStudy[activeSegment.index].feasibilityStudy.length - 1,
        case: titles[titles.length - 1],
        condition: segmentoption,
      }),
    );

    dispatch(setSegments(caseStudy));
    setTitles([]);
    setIsLoading(false);
    props.onClose(false);
  };

  const handleClose = () => {
    setTitles([]);
    props.onClose(false);
  };

  return (
    <div className="AddCriteria-container">
      <Modal
        isOpen={props.isOpen}
        onClose={handleClose}
        closable
        title={addCriteriaTitle}
        width={1000}
        handleActionClick={() => SaveConditions(titles)}
        okButtonLabel={saveButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        confirmLoading={isloading}
      >
        <Segaments
          options={['Inclusion', 'Exclusion']}
          size={'large'}
          onChange={(e) => setSegmentOption(e)}
        />
        <div className="AddCriteria-container_Card-wrapper">
          {IconList.map((ele, index) => {
            if (ele?.Title !== 'Location') {
              return (
                <Card
                  data-testid="case-study-card"
                  key={index}
                  style={{
                    borderRadius: '10px',
                    border: '1px solid  rgba(45, 51, 57, 0.12)',
                    cursor: 'pointer',
                    backgroundColor: titles.includes(ele.Title)
                      ? '#F6F7F9'
                      : 'white',
                  }}
                  onClick={() => Titles(ele)}
                >
                  <div className="AddCriteria-container_card-elements">
                    <div>{ele.Icons}</div>
                    <div>{ele.Title}</div>
                  </div>
                </Card>
              );
            }
          })}
        </div>
      </Modal>
    </div>
  );
}

AddCriteria.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
AddCriteria.defaultProps = {
  isOpen: false,
  onClose: () => {},
};
