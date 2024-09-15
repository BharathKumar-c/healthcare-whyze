import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'antd';

export default function ImageComp({
  className,
  style,
  alt,
  height,
  width,
  preview,
  src,
  onClick,
}) {
  return (
    <Image
      className={className}
      style={style}
      alt={alt}
      height={height}
      width={width}
      preview={preview}
      src={src}
      onClick={onClick}
    />
  );
}

ImageComp.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string,
  alt: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  preview: PropTypes.bool,
  onClick: PropTypes.func,
};

ImageComp.defalutProps = {
  className: '',
  alt: '',
  height: 10,
  width: 10,
  preview: false,
  src: '',
  style: null,
  onClick: null,
};
