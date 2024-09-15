import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { Lable } from '..';
import './textArea.scss';

const { TextArea } = Input;

export default function TextAreaField({
  isAllowClear,
  isBordered,
  id,
  lable,
  placeholder,
  className,
  maxLength,
  autoSize,
  style,
  isError,
  errorText,
  handleInputChange,
  onPressEnter,
  onResize,
  name,
  value,
}) {
  const statusFlag = isError ? 'error' : '';
  return (
    <div id={id} className={className}>
      {lable && <Lable className="text-area-lable" text={lable} />}
      <TextArea
        className="text-area-input"
        style={style}
        isAllowClear={isAllowClear}
        autoSize={autoSize}
        name={name}
        bordered={isBordered}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={handleInputChange}
        onPressEnter={onPressEnter}
        onResize={onResize}
        status={statusFlag}
        value={value}
      />
      {isError && <span style={{ color: 'red' }}>{errorText}</span>}
    </div>
  );
}

TextAreaField.propTypes = {
  isAllowClear: PropTypes.bool,
  isBordered: PropTypes.bool,
  id: PropTypes.string,
  isError: PropTypes.bool,
  errorText: PropTypes.string,
  lable: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  autoSize: PropTypes.bool,
  style: PropTypes.object,
  handleInputChange: PropTypes.func,
  onPressEnter: PropTypes.func,
  onResize: PropTypes.func,
};

TextAreaField.defaultProps = {
  isAllowClear: false,
  isBordered: true,
  isError: false,
  errorText: '',
  id: '',
  lable: '',
  placeholder: '',
  name: '',
  value: '',
  className: '',
  maxLength: 30,
  autoSize: false,
  style: {},
  handleInputChange: () => {},
  onPressEnter: () => {},
  onResize: () => {},
};
