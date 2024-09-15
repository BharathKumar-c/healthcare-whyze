import React from 'react';
import { FloatButton } from 'antd';
import PropTypes from 'prop-types';

const FloatingButton = ({ Icon, style, shape, description }) => (
  <FloatButton
    icon={Icon}
    description={description}
    shape={shape}
    style={style}
  />
);

FloatingButton.propTypes = {
  Icon: PropTypes.string,
  style: PropTypes.object,
  shape: PropTypes.any,
  description: PropTypes.string,
};

FloatingButton.defalutProps = {
  totalpatient: '',
  style: null,
  shape: '',
  description: '',
};
export default FloatingButton;
