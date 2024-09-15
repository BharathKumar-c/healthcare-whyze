import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconList } from '../../../constant/IconData';
import { Space } from 'antd';
import { Input, Button } from '../../basic';
import { Tick } from '../../../assets';

const IconCondition = ({ Titleandlogo, isRename, handleRename }) => {
 
  const [name, setName] = useState(Titleandlogo?.name || '');
  const list = IconList?.find((ele) => ele.Title == Titleandlogo.case);
  return (
    <Space size={20}>
      <div>{list?.Icons}</div>
      <div style={{ fontWeight: 700, fontSize: '24px' }}>
        {isRename ? (
          <div style={{ display: 'flex' }}>
            <Input
              value={name}
              handleInputChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Button
              icon={<Tick />}
              label={''}
              size={'medium'}
              style={{ marginTop: '6px' }}
              handleButtonClick={() => {
                handleRename(name);
              }}
            />
          </div>
        ) : (
          Titleandlogo?.name
        )}
      </div>
    </Space>
  );
};

IconCondition.propTypes = {
  children: PropTypes.string,
  Titleandlogo: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      case: PropTypes.string,
    }),
  ),
  isRename: PropTypes.bool,
  handleRename: PropTypes.func,
};
IconCondition.defalutProps = {
  children: '',
  Titleandlogo: {
    name: '',
    case: '',
  },
  isRename: false,
  handleRename: () => {},
};
export default IconCondition;
