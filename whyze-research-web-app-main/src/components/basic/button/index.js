import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ButtonComponent = ({
  shape,
  type,
  label,
  href,
  icon,
  size,
  className,
  style,
  name,
  fullWidth,
  isError,
  isLoading,

  disabled,
  handleButtonClick,
}) => {
  return (
    <Button
      className={className}
      style={style || { textTransform: 'none' }}
      block={fullWidth}
      danger={isError}
      disabled={disabled}
      loading={isLoading}
      shape={shape}
      type={type}
      data-testid={className}
      name={name}
      onClick={handleButtonClick}
      icon={icon}
      href={href}
      size={size}
    >
      {label}
    </Button>
  );
};

ButtonComponent.propTypes = {
  shape: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  handleButtonClick: PropTypes.func,
  icon: PropTypes.object,
  href: PropTypes.string,
  size: PropTypes.string,
};

ButtonComponent.defalutProps = {
  shape: '',
  type: '',
  label: '',
  className: '',
  name: '',
  fullWidth: false,
  isError: false,
  isLoading: false,
  disabled: false,
  style: null,
  handleButtonClick: null,
  icon: null,
  href: '',
  size: '',
};

export default ButtonComponent;
