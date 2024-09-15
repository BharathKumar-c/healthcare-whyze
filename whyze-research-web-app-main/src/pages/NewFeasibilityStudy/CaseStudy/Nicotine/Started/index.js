import React from 'react';
import PropTypes from 'prop-types';
import { Row, Space, Tag } from 'antd';
import { Image, Input } from '../../../../../components/basic';
import { ConditionContainer } from '../../../../../components/shared';
import DragIcon from '../../../../../assets/DragIcon.svg';
import CloseIcon from '../../../../../assets/CloseIcon.svg';
import { Vector } from '../../../../../assets';
import { useSelector, useDispatch } from 'react-redux';
import { removeChildInCaseStudy } from '../../../../../components/shared/AddCondition';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import { totalPatientFormatter } from '../../../../../utils/calculations';

export default function Started({
  totalpatient,
  parentIndex,
  caseDetails,
  isChild,
  parentId,
}) {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const dispatch = useDispatch();

  const handleRemoveCondition = (id) => {
    const study = JSON.parse(JSON.stringify(segments));
    removeChildInCaseStudy(
      study[activeSegment.index].feasibilityStudy[parentIndex].child,
      parentId,
      id,
    );
    dispatch(setSegments(study));
  };

  const handleInputChange = (event) => {
    const study = JSON.parse(JSON.stringify(segments));
    study[activeSegment.index].feasibilityStudy[parentIndex].child[0].started[
      event.target.name
    ] = event.target.value;
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
        <div className="started-container-alignment">
          <div className="drag-drop-image">
            <Image
              alt={'drag-icon'}
              src={DragIcon}
              width={10}
              height={16}
              preview={false}
            />
          </div>
          <div className="condition-container-input">
            <Input
              type="number"
              lable="From"
              name="start"
              value={caseDetails?.started?.start}
              handleInputChange={handleInputChange}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="condition-container-input">
            <Input
              type="number"
              lable="To"
              name="to"
              value={caseDetails?.started?.to}
              handleInputChange={handleInputChange}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="close-icon">
            <Image
              alt={'close-icon'}
              src={CloseIcon}
              className="image"
              width={20}
              height={20}
              preview={false}
              onClick={() => handleRemoveCondition(caseDetails.id, parentId)}
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
    </ConditionContainer>
  );
}

Started.propTypes = {
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  totalpatient: PropTypes.string,
  parentId: PropTypes.string,
  caseDetails: PropTypes.object,
};

Started.defaultProps = {
  parentIndex: 0,
  isChild: false,
  totalpatient: '',
  parentId: '',
  caseDetails: null,
};
