import React from 'react';
import { Icon } from '../../../basic';
import { Space, Tag } from 'antd';
import PropTypes from 'prop-types';

export default function Title({ title, tagtitle, isRename, handleRename }) {
  return (
    <>
      <Space size={20} direction="horizontal">
        <Icon
          Titleandlogo={title}
          isRename={isRename}
          handleRename={handleRename}
        />
        {tagtitle == 'Inclusion' ? (
          <Tag className="titlecomponenet-tag">{tagtitle}</Tag>
        ) : tagtitle === 'Exclusion' ? (
          <Tag className="titlecomponenet-tag__Exclusion">{tagtitle}</Tag>
        ) : null}
      </Space>
    </>
  );
}

Title.propTypes = {
  title: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      case: PropTypes.string,
    }),
  ),
  tagtitle: PropTypes.string,
  isRename: PropTypes.bool,
  handleRename: PropTypes.func,
};

Title.defalutProps = {
  title: {
    name: '',
    case: '',
  },
  tagtitle: '',
  isRename: false,
  handleRename: () => {},
};
