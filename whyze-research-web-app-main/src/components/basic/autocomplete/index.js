import React from 'react';
import { AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import { Lable } from '..';
import './autocomplete.scss';

const AutoCompleteComponent = ({
  options,
  placeholder,
  label,
  width,
  isError,
  getPopupContainer,
  value,
  errorText,
  handleInputChange,
  handleSelect,
  handleSearch,
}) => {
  const statusFlag = isError ? 'error' : '';
  return (
    <div className="autoComplete-wrapper">
      {label && <Lable className="input-lable" text={label} />}
      <AutoComplete
        getPopupContainer={getPopupContainer}
        className="autoComplete-wrapper-input"
        options={options}
        style={{ width: width }}
        placeholder={placeholder}
        filterOption={(inputValue, option) =>
          option?.value?.toUpperCase().indexOf(inputValue?.toUpperCase()) !== -1
        }
        value={value}
        status={statusFlag}
        onChange={handleInputChange}
        onSelect={handleSelect}
        onSearch={handleSearch}
      />
      {isError && <span style={{ color: 'red' }}>{errorText}</span>}
    </div>
  );
};
AutoCompleteComponent.propTypes = {
  options: PropTypes.array,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  width: PropTypes.string,
  errorText: PropTypes.string,
  value: PropTypes.string,
  isError: PropTypes.bool,
  handleInputChange: PropTypes.func,
  handleSelect: PropTypes.func,
  getPopupContainer: PropTypes.func,
  handleSearch: PropTypes.func,
};
AutoCompleteComponent.defalutProps = {
  options: [],
  placeholder: '',
  label: '',
  width: '',
  errorText: '',
  value: '',
  isError: false,
  handleInputChange: null,
  getPopupContainer: () => {},
  handleSelect: null,
  handleSearch: null,
};
export default AutoCompleteComponent;
