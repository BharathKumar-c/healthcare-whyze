import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { Lable } from '..';
import './Select.scss';

const SelectComp = ({
  id,
  defaultValue,
  className,
  placeholder,
  mode,
  size,
  lable,
  ariaLabel,
  isAllowClear,
  isLoading,
  isShowSearch,
  disabled,
  options,
  style,
  suffixIcon,
  handleSelect,
  name,
  value,
  tagRender,
  isError,
  errorText,
  getPopupContainer,
}) => {
  const statusFlag = isError ? 'error' : '';

  return (
    <div id={id} className="alignment">
      {lable && <Lable className="select-lable" text={lable} />}
      <Select
        aria-label={ariaLabel}
        className={className}
        style={style}
        mode={mode}
        size={size}
        allowClear={isAllowClear}
        defaultValue={defaultValue}
        disabled={disabled}
        loading={isLoading}
        showSearch={isShowSearch}
        onChange={handleSelect}
        options={options}
        suffixIcon={suffixIcon}
        placeholder={placeholder}
        getPopupContainer={getPopupContainer}
        optionFilterProp="children"
        name={name}
        value={value}
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
        }
        status={statusFlag}
        tagRender={tagRender}
      />
      {isError && <span style={{ color: 'red' }}>{errorText}</span>}
    </div>
  );
};

SelectComp.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  mode: PropTypes.string,
  size: PropTypes.string,
  placeholder: PropTypes.string,
  lable: PropTypes.string,
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  isAllowClear: PropTypes.bool,
  isLoading: PropTypes.bool,
  isShowSearch: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  style: PropTypes.object,
  suffixIcon: PropTypes.node,
  getPopupContainer: PropTypes.func,
  handleSelect: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
  tagRender: PropTypes.any,
  isError: PropTypes.bool,
  errorText: PropTypes.string,
};

SelectComp.defalutProps = {
  className: '',
  defaultValue: '',
  mode: 'tags',
  size: 'default',
  placeholder: '',
  lable: '',
  ariaLabel: '',
  id: '',
  isAllowClear: false,
  isLoading: false,
  isShowSearch: false,
  disabled: false,
  style: null,
  suffixIcon: null,
  getPopupContainer: () => {},
  options: [],
  handleSelect: null,
  name: '',
  value: '',
  tagRender: null,
  isError: false,
  errorText: '',
};

export default SelectComp;
