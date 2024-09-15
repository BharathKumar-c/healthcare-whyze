import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { Lable } from '..';
import './Input.scss';

export default function InputField({
  placeholder,
  handleInputChange,
  value,
  lable,
  type,
  id,
  isError,
  errorText,
  width,
  name,
  ref,
  style,
  prefix,
  suffix,
  className,
  disabled,
  onKeyDown,
  onWheel,
}) {
  const statusFlag = isError ? 'error' : '';
  return (
    <div id={id} className={className}>
      {lable && <Lable className="input-lable" text={lable} />}
      <Input
        style={{ borderRadius: '0px', width: width, ...style }}
        placeholder={placeholder || ''}
        type={type}
        value={value}
        name={name}
        ref={ref}
        onChange={handleInputChange}
        status={statusFlag}
        prefix={prefix}
        suffix={suffix}
        data-testid={id}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
      />
      {isError && <span style={{ color: 'red' }}>{errorText}</span>}
    </div>
  );
}

InputField.propTypes = {
  placeholder: PropTypes.string,
  handleInputChange: PropTypes.func,
  ref: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  lable: PropTypes.string,
  id: PropTypes.string,
  isError: PropTypes.bool,
  errorText: PropTypes.string,
  width: PropTypes.number,
  name: PropTypes.string,
  style: PropTypes.object,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onWheel: PropTypes.func,
};
InputField.defalutProps = {
  placeholder: '',
  handleInputChange: null,
  value: '',
  ref: null,
  type: 'text',
  lable: '',
  id: '',
  isError: false,
  errorText: '',
  width: 120,
  name: '',
  style: {},
  prefix: null,
  suffix: null,
  className: '',
  disabled: false,
  onKeyDown: null,
  onWheel: null,
};
