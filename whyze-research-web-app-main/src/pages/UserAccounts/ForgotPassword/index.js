import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackArrow, WhyzeLogo } from '../../../assets';
import { Button, Input } from '../../../components/basic';
import {
  errorConstants,
  labelAndTitleConstants,
  regexConstants,
} from '../../../constant';
import './forgotPassword.scss';
import ApiUtil from '../../../utils/ApiUtils';
import { authEndPoints } from '../../../constant/ApiEndPoints';
import { RoutesUrls } from '../../../constant/RoutesUrls';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleProceed = async () => {
    if (email === '') {
      setEmailError(true);
    } else {
      const regexEmail = regexConstants.emailRegex.test(email);
      if (!regexEmail) {
        setEmailError(true);
      } else {
        setEmailError(false);
        setIsLoading(true);
        try {
          await ApiUtil.forgotPassword(authEndPoints.forgotPassword, {
            email: email,
          }).then((res) => {
            setIsLoading(false);
            navigate('/', {
              state: { from: 'forgotPassword', message: res.data.message },
            });
          });
        } catch (error) {
          setIsLoading(false);
          console.log(error);
        }
      }
    }
  };

  return (
    <div className="forgot-password-component">
      <div className="forgot-password-component-logo">
        <WhyzeLogo /> &nbsp;&nbsp;&nbsp;
        {labelAndTitleConstants.applicationName}
      </div>
      <div className="forgot-password-component-title">
        {labelAndTitleConstants.forgotPassword}
      </div>
      <div className="forgot-password-component-description">
        {labelAndTitleConstants.forgotPasswordDescription}
      </div>
      <div className="forgot-password-component-input-box">
        <Input
          id="main_textbox"
          lable={labelAndTitleConstants.email}
          name={'email'}
          value={email}
          handleInputChange={(e) => handleChange(e)}
          isError={emailError}
          errorText={
            email === '' && emailError
              ? errorConstants.emailMustBeEntered
              : emailError
              ? errorConstants.enterValidEmailAddress
              : ''
          }
        />
      </div>
      <div className="forgot-password-component-button-group">
        <Button
          handleButtonClick={() => handleProceed()}
          label={labelAndTitleConstants.resetPassword}
          size={'large'}
          isLoading={isLoading}
        />
      </div>
      <div className="forgot-password-component-backto-login">
        <div>
          <BackArrow />
        </div>
        <div>
          <h3>
            <a
              onClick={() => {
                navigate(RoutesUrls.loginUrl);
              }}
            >
              {labelAndTitleConstants.backTo}&nbsp;
              {labelAndTitleConstants.signIn}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
