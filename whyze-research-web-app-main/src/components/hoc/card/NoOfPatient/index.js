import React from 'react';
import { Space } from 'antd';
import { Options, Vector } from '../../../../assets';
import PropTypes from 'prop-types';
import { DropDown } from '../../../basic';
import { items } from '../../../../constant/DropdownData/DropdownData';
import { totalPatientFormatter } from '../../../../utils/calculations';

export default function NoOfPatient({
  totalpatient,
  handleSelectOption,
  getPopupContainer,
}) {
  function handleChange(value) {
    handleSelectOption(value.key);
  }

  return (
    <Space size={20} direction="horizontal" align="end">
      <div className="card-component__Vector-icon">
        <>
          <Vector />
          {totalPatientFormatter(totalpatient || 0)}
        </>
      </div>
      <DropDown
        items={items}
        onChange={handleChange}
        getPopupContainer={() => document.getElementById(getPopupContainer)}
      >
        <Options style={{ cursor: 'pointer' }} />
      </DropDown>
    </Space>
  );
}

NoOfPatient.propTypes = {
  getPopupContainer: PropTypes.string,
  totalpatient: PropTypes.number,
  handleSelectOption: PropTypes.func,
};

NoOfPatient.defalutProps = {
  getPopupContainer: '',
  totalpatient: 0,
  handleSelectOption: () => {},
};
