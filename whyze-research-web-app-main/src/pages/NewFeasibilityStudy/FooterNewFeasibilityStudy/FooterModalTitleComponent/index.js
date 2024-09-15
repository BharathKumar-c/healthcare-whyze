import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '../../../../components/basic';

export default function Title({ title, logo, className }) {
  return (
    <div className={className}>
      <Image
        src={logo}
        alt="modal-title-logo"
        width={40}
        height={40}
        preview={false}
      />
      <h3>{title}</h3>
    </div>
  );
}

Title.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  isSubComp: PropTypes.bool,
  className: PropTypes.string,
  onBack: PropTypes.func,
};

Title.defalutProps = {
  logo: '',
  bgImage: '',
  isSubComp: false,
  className: '',
  onBack: () => {},
};
