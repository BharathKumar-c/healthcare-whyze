import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

export default function PopoverComp({
  id,
  content,
  title,
  placement,
  trigger,
  children,
}) {
  return (
    <Popover
      id={id}
      content={content}
      title={title}
      trigger={trigger}
      placement={placement}
    >
      {children}
    </Popover>
  );
}

PopoverComp.propTypes = {
  id: PropTypes.string,
  placement: PropTypes.string,
  trigger: PropTypes.string,
  content: PropTypes.node,
  title: PropTypes.node,
  children: PropTypes.node,
};

PopoverComp.defaultProps = {
  id: '',
  placement: 'bottomRight',
  trigger: 'hover',
  totalNoOfPatients: 0,
  countriesList: [],
  children: null,
};
