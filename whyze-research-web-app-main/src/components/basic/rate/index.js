import React from 'react';
import PropTypes from 'prop-types';

import { Rate } from 'antd';
const RateComponent = ({ defaultvalue, className, value }) => {
  return (
    <Rate
      className={className}
      defaultValue={defaultvalue}
      allowHalf
      value={value}
    />
  );
};
RateComponent.propTypes = {
  defaultvalue: PropTypes.number,
  className: PropTypes.string,
  value: PropTypes.number,
};

RateComponent.defaultProps = {
  defaultvalue: null,
  className: '',
  value: null,
};
export default RateComponent;
