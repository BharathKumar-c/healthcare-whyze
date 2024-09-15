import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';

const DropDown = ({
  id,
  style,
  items,
  children,
  onChange,
  className,
  getPopupContainer,
}) => {
  return (
    <Dropdown
      id={id}
      style={style}
      className={className}
      menu={{
        items,
        onClick: onChange,
      }}
      getPopupContainer={getPopupContainer}
      trigger={['click']}
    >
      {children}
    </Dropdown>
  );
};

DropDown.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  getPopupContainer: PropTypes.func,
  items: PropTypes.array || PropTypes.node,
  style: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

DropDown.defalutProps = {
  id: '',
  className: '',
  getPopupContainer: () => {},
  items: [] || null,
  style: null,
  onChange: null,
  children: null,
};

export default DropDown;
