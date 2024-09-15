import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
const TagField = ({
  color,
  closable,
  closeIcon,
  onClose,
  className,
  children,
  icon
}) => {
  return (
    <Tag
      closable={closable}
      color={color}
      closeIcon={closeIcon}
      onClose={onClose}
      className={className}
      icon={icon}
    >
      {' '}
      {children}
    </Tag>
  );
};
TagField.propTypes = {
  color: PropTypes.string,
  onClose: PropTypes.func,
  className: PropTypes.string,
  closeIcon: PropTypes.node,
  children: PropTypes.node,
  closable: PropTypes.bool,
  icon:PropTypes.node
};
TagField.defaultProps = {
  onClose: () => {},
  className: '',
  color: '',
  closeIcon: null,
  closable: false,
  children: null,
  icon:PropTypes.node

};

export default TagField;
