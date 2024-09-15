import React from 'react';
import { Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text, Title } = Typography;

export default function TextComponent({
  className,
  text,
  type,
  headerType,
  style,
}) {
  return headerType ? (
    <Title className={className} level={headerType} style={style}>
      {text}
    </Title>
  ) : (
    <Text className={className} type={type} style={style}>
      {text}
    </Text>
  );
}

TextComponent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.any,
  type: PropTypes.string,
  headerType: PropTypes.number,
  style: PropTypes.object,
};

TextComponent.defalutProps = {
  className: '',
  text: '',
  type: '',
  headerType: 1,
  style: null,
};
