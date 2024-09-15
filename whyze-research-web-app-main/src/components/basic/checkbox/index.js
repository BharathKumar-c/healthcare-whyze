/* eslint-disable react/prop-types */
import React from 'react';
import './Checkbox.scss';
import PropTypes from 'prop-types';
import { Lable } from '..';
import { Checkbox } from 'antd';

const CheckboxComponent = ({
  className,
  style,
  id,
  value,
  handleChecked,
  disabled,
  name,
  lable,
}) => {
  return (
    <div style={style} className={className}>
      <Checkbox
        id={id}
        checked={value}
        onChange={(e) => handleChecked(e)}
        disabled={disabled}
        name={name}
      />

      <Lable level={2} text={lable} style={{ marginLeft: '1rem' }} />
    </div>
  );
};

CheckboxComponent.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  lable: PropTypes.string,
  className: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func,
};

CheckboxComponent.defalutProps = {
  id: '',
  name: '',
  lable: '',
  className: '',
  checked: false,
  disabled: false,
  style: null,
  onChange: () => {},
};

export default CheckboxComponent;
