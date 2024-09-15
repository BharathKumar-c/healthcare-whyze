import React from 'react';
import { Image, Input } from '../../../../components/basic';
import AddIcon from '../../../../assets/AddIcon.svg';
import PropTypes from 'prop-types';

const Previousstudy = () => {
  return (
    <div>
      <Input id="main_textbox" lable="Previous study condition" />
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

Previousstudy.propTypes = {
  caseDetails: PropTypes.array,
  parentIndex: PropTypes.number,
  isChild: PropTypes.bool,
  handleAddCondition: PropTypes.func,
  handleChangeCaseName: PropTypes.func,
};

Previousstudy.defaultProps = {
  caseDetails: [],
  parentIndex: 0,
  isChild: false,
  handleAddCondition: () => {},
  handleChangeCaseName: () => {},
};
export default Previousstudy;
