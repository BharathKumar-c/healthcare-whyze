import React from 'react';
import { Segmented } from 'antd';

const segamentsComponent = ({ size, options, onChange }) => {
  return (
    <Segmented
      options={options}
      size={size}
      defaultValue={options.length[0]}
      onChange={onChange}
    />
  );
};

export default segamentsComponent;
