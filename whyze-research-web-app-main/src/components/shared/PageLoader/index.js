// PageLoader Component
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

import './PageLoader.scss';

// Loader Icon
const loadIcon = <LoadingOutlined style={{ fontSize: 60 }} />;

// Main component
export default function PageLoader() {
  const { isLoading } = useSelector((state) => state.authReducer);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="page-loader">
      <Spin
        className="page-loader-spinner"
        spinning={isLoading}
        indicator={loadIcon}
      />
    </div>
  );
}
