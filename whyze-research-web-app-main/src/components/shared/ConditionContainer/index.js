import React from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';
import './ConditionContainer.scss';

export default function ConditionContainer({
  isActive,
  isVertical,
  isChild,
  children,
  className,
}) {
  return (
    <Space
      className={className}
      style={{
        border: isChild ? '' : `2px ${isActive ? 'solid' : 'dashed'} #D3D6D9`,
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        marginBottom: '0.5rem',
        marginLeft: isChild ? '5%' : 'unset',
        padding: isChild ? 'unset' : '20px 30px 12px 20px',
      }}
    >
      {children}
    </Space>
  );
}

ConditionContainer.propTypes = {
  isActive: PropTypes.bool,
  isVertical: PropTypes.bool,
  isChild: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

ConditionContainer.defalutProps = {
  isActive: false,
  isVertical: false,
  isChild: false,
  children: null,
  className: '',
};
