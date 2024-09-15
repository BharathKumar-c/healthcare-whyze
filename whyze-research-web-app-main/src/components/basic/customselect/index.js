import { Col, Row, Space } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import DropDown from '../dropdown';
import { Text } from '..';
import './CustomSelect.scss';

export default function CustomSelect({
  options,
  onSelect,
  defaultValue,
  getPopupContainer,
}) {
  const [value, setValue] = useState(
    defaultValue ? defaultValue : options[0]?.label,
  );

  const handleSelect = (event) => {
    const selectedOption =
      options && options.filter((ele) => ele.key === event?.key);
    setValue(selectedOption[0]?.label);
    onSelect(selectedOption[0]?.key);
  };

  return (
    <Space direction="vertical" id="custom-select-box">
      <DropDown
        id="custom-select-box"
        items={options}
        onChange={handleSelect}
        getPopupContainer={() => document.getElementById(getPopupContainer)}
      >
        <Row className="custom-select">
          <Col span={16} className="custom-select-text">
            <Text
              type="secondary"
              text={value}
              className="custom-select-placeholder"
            />
          </Col>
          <Col span={8} className="custom-select-arrow">
            <DownOutlined />
          </Col>
        </Row>
      </DropDown>
    </Space>
  );
}

CustomSelect.propTypes = {
  options: PropTypes.array,
  onSelect: PropTypes.func,
  defaultValue: PropTypes.string,
  getPopupContainer: PropTypes.string,
};

CustomSelect.defalutProps = {
  options: [],
  onSelect: null,
  defaultValue: '',
  getPopupContainer: '',
};
