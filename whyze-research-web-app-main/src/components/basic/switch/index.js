import { Switch } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const switchComponent = ({
  size,
  onChange,
  checkedChildren,
  unCheckedChildren,
  disabled,
  defaultChecked,
  checked
}) => {


  return (
    <Switch
    checked={checked}
      size={size}
      onChange={onChange}
      checkedChildren={checkedChildren}
      disabled={disabled}
      unCheckedChildren={unCheckedChildren}
      defaultChecked={defaultChecked}
    />
  );
};

switchComponent.propTypes = {
  size: PropTypes.string,
  onChange: PropTypes.func,
  checkedChildren: PropTypes.string,
  unCheckedChildren: PropTypes.string,
  disabled: PropTypes.object,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
};
switchComponent.defaultProps = {
  size: '',
  onChange: () => {},
  checkedChildren: '',
  unCheckedChildren: '',
  disabled: null,
  defaultChecked: false,
  checked:true
};

export default switchComponent;