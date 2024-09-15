import React from 'react';
import { Modal } from '../../../../components/hoc';
import PropTypes from 'prop-types';
import {
  setActiveSegment,
  setSegments,
} from '../../../../redux/reducer/feasibilityStudyReducer';
import { useSelector, useDispatch } from 'react-redux';

const AlertMessageModel = (props) => {
  const { segments } = useSelector((state) => state.feasibilityStudyReducer);
  const dispatch = useDispatch();

  const handleSelectOption = () => {
    if (segments.length > 1) {
      const caseStudy = [...segments];
      caseStudy.splice(props?.activeSegment.index, 1);
      dispatch(setSegments(caseStudy));
      dispatch(
        setActiveSegment({
          name:
            props?.activeSegment.index !== 0
              ? caseStudy[props?.activeSegment.index - 1]?.name
              : caseStudy[props?.activeSegment.index].name,
          index:
            props?.activeSegment.index !== 0
              ? props?.activeSegment.index - 1
              : 0,
        }),
      );
      props.onClose(false);
    } else {
      props.onClose(false);
    }
  };

  const handleClose = () => {
    props.onClose(false);
  };
  return (
    <Modal
      title={`${props?.activeSegment.name}`}
      okButtonLabel={'Ok'}
      cancelButtonLabel={'Cancel'}
      isOpen={props.isOpen}
      onClose={handleClose}
      handleActionClick={handleSelectOption}
    >
      {segments.length > 1 ? (
        <h4>Are you sure you want to delete this segment?</h4>
      ) : (
        <h4>Unable to delete this segment. At least one segment is needed</h4>
      )}
    </Modal>
  );
};

export default AlertMessageModel;

AlertMessageModel.propTypes = {
  activeSegment: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

AlertMessageModel.defaultProps = {
  activeSegment: null,
  isOpen: false,
  onClose: () => {},
};
