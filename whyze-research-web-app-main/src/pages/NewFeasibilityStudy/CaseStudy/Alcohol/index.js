import React from 'react';
import { Image, Input } from '../../../../components/basic';
import AddIcon from '../../../../assets/AddIcon.svg';
import PropTypes from 'prop-types';

const Alcohol = () => {
  return (
    <div>
      <Input id="main_textbox" lable="Alcohol condition" />
      <div style={{ height: '30px' }}>
        <Image
          style={{ cursor: 'pointer' }}
          preview={false}
          width={12}
          height={12}
          src={AddIcon}
        />
      </div>
    </div>
  );
};

Alcohol.propTypes = {
  caseDetails: PropTypes.array,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Alcohol.defaultProps = {
  caseDetails: [],
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
export default Alcohol;
