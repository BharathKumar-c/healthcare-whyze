import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HidePass, ShowpassIcon, WhyzeLogo } from '../../../assets';
import { Button, Input } from '../../../components/basic';
import {
  errorConstants,
  labelAndTitleConstants,
  regexConstants,
} from '../../../constant';
import { authEndPoints } from '../../../constant/ApiEndPoints';
import ApiUtil from '../../../utils/ApiUtils';
import './setupPassword.scss';
import { RoutesUrls } from '../../../constant/RoutesUrls';

const SetupPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordIserror, setPasswordIserror] = useState(false);
  const [confirmpasswordiserror, setConfirmPassIserror] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');

  const [isLoading, setIsLoading] = useState(false);
  const [queryToken, setQueryToken] = useState();

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const queryToken = queryParameters.get('token');
    setQueryToken(queryToken);
  }, []);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };
  const confirmPasswordtoggle = () => {
    if (confirmPasswordType === 'password') {
      setConfirmPasswordType('text');
      return;
    }
    setConfirmPasswordType('password');
  };
  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };
  const handleProceed = async () => {
    if (password === '') {
      setPasswordError(errorConstants.passwordMustBeEntered);
      setPasswordIserror(true);
    } else if (password.length < 8) {
      setPasswordError(errorConstants.passwordLength);
      setPasswordIserror(true);
    } else if (!regexConstants.passwordRegex.test(password)) {
      setPasswordError(errorConstants.passwordMustContainReqCharacters);
      setPasswordIserror(true);
    } else {
      setPasswordError('');
      setPasswordIserror(false);
    }

    if (confirmPassword === '') {
      setConfirmPasswordError(errorConstants.passwordMustBeEntered);
      setConfirmPassIserror(true);
    } else {
      setConfirmPasswordError('');
      setConfirmPassIserror(false);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(errorConstants.passwordsDoNotMatch);
      setConfirmPassIserror(true);
    } else {
      setIsLoading(true);
      setConfirmPasswordError('');
      setConfirmPassIserror(false);
      try {
        await ApiUtil.forgotPassword(authEndPoints.resetPassword, {
          password: password,
          token: queryToken,
        }).then(() => {
          setIsLoading(false);
          navigate(RoutesUrls.loginUrl, { replace: true });
        });
      } catch (error) {
        navigate('/', {
          state: {
            from: 'resetPassword',
            message: error.response.data.message,
          },
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="setup-password-component">
      <div className="setup-password-component-logo">
        <WhyzeLogo /> &nbsp;&nbsp;&nbsp;
        {labelAndTitleConstants.applicationName}
      </div>
      <div className="setup-password-component-title">
        {labelAndTitleConstants.createNewPassword}
      </div>
      <div className="setup-password-component-description">
        {labelAndTitleConstants.chooseStrongPassword}
      </div>
      <div className="setup-password-component-input-box">
        <Input
          lable={labelAndTitleConstants.password}
          type={passwordType}
          name={'password'}
          value={password}
          isError={passwordIserror}
          errorText={passwordError}
          suffix={
            passwordType === 'password' ? (
              <ShowpassIcon onClick={togglePassword} />
            ) : (
              <HidePass onClick={togglePassword} />
            )
          }
          handleInputChange={(e) => handleChange(e)}
        />
      </div>
      <div className="setup-password-component-input-box">
        <Input
          lable={labelAndTitleConstants.confirmPassword}
          type={confirmPasswordType}
          name={'confirmPassword'}
          value={confirmPassword}
          isError={confirmpasswordiserror}
          errorText={confirmPasswordError}
          suffix={
            confirmPasswordType === 'password' ? (
              <ShowpassIcon onClick={confirmPasswordtoggle} />
            ) : (
              <HidePass onClick={confirmPasswordtoggle} />
            )
          }
          handleInputChange={(e) => handleChange(e)}
        />
      </div>
      <div className="setup-password-component-button-group">
        <Button
          handleButtonClick={() => handleProceed()}
          label={labelAndTitleConstants.changePassword}
          size={'large'}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default SetupPassword;
