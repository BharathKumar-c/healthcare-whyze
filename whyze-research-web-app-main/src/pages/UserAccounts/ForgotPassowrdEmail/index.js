// ForgotPasswordEmail
import React from 'react';
import { useSelector } from 'react-redux';

import { WhyzeTextLogo } from '../../../assets';
import { labelAndTitleConstants } from '../../../constant';
import '../ForgotPassword/index';

const ForgotPasswordEmail = () => {
  const { message } = useSelector((state) => state.authReducer);

  return (
    <div className="forgot-password-component">
      <div className="forgot-password-component-logo">
        <WhyzeTextLogo />
      </div>
      <div className="forgot-password-component-title">
        {labelAndTitleConstants.resetPasswordTitle}
      </div>
      <div className="forgot-password-component-description">{message}</div>
    </div>
  );
};

export default ForgotPasswordEmail;
