import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '../../../basic';
import { BackArrow } from '../../../../assets';

export default function Title({ title, logo, isSubComp, onBack }) {
  return (
    <div className={title === 'Project settings' ? 'modal-title-bg' : 'modal-title'}>
      {title === 'Project settings' && (
        <Image src={logo} width={40} height={40} preview={false} />
      )}
      {(isSubComp && title === 'Share project link') && <BackArrow className='modal-title-back' onClick={() => onBack(title)} />}
      <h3>{title}</h3>
    </div>
  );
}

Title.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  isSubComp: PropTypes.bool,
  onBack: PropTypes.func,
};

Title.defalutProps = {
  logo: '',
  bgImage: '',
  isSubComp: false,
  onBack: () => {},
};
