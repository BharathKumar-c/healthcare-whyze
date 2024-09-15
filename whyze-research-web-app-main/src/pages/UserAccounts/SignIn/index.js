import React, { useState } from 'react';
import { HidePass, ShowpassIcon, WhyzeTextLogo } from '../../../assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '../../../components/basic';
import './signIn.scss';
import ApiUtil from '../../../utils/ApiUtils';
import { authEndPoints } from '../../../constant/ApiEndPoints';
import {
  errorConstants,
  labelAndTitleConstants,
  regexConstants,
} from '../../../constant';
import { RoutesUrls } from '../../../constant/RoutesUrls';
import { message } from 'antd';

const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayed, setDispalyed] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'email') {
      setEmail(value);
      setIsEmailError(false);
      setEmailErrorText('');
    } else if (name === 'password') {
      setPassword(value);
      setIsPasswordError(false);
      setPasswordErrorText('');
    }
  };

  const handleSignIn = async () => {
    if (email === '' && password === '') {
      setIsEmailError(true);
      setIsPasswordError(true);
      setEmailErrorText(errorConstants.emailMustBeEntered);
      setPasswordErrorText(errorConstants.passwordMustBeEntered);
    } else if (email === '') {
      setIsEmailError(true);
      setEmailErrorText(errorConstants.emailMustBeEntered);
    } else if (password === '') {
      setIsPasswordError(true);
      setPasswordErrorText(errorConstants.passwordMustBeEntered);
    } else {
      const regexEmail = regexConstants.emailRegex.test(email);
      if (!regexEmail) {
        setIsEmailError(true);
        setEmailErrorText(errorConstants.enterValidEmailAddress);
      } else {
        setIsEmailError(false);
        setIsPasswordError(false);
        setEmailErrorText('');
        setPasswordErrorText('');
        setIsLoading(true);
        try {
          await ApiUtil.loginUser(authEndPoints.login, {
            email: email,
            password: password,
          }).then(() => {
            setIsLoading(false);
            navigate(RoutesUrls.dashBoardUrl);
          });
        } catch (error) {
          setIsLoading(false);
          console.log(error);
          setIsEmailError(true);
          setIsPasswordError(true);
          setPasswordErrorText(errorConstants.inCorrectEmailPassword);
        }
      }
    }
  };

  const displayMessage = (val) => {
    setDispalyed(true);
    if (location?.state?.from === 'forgotPassword') {
      return message.success(val);
    } else {
      return message.error(val);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSignIn();
    }
  };
  return (
    <div className="sign-in-component">
      {location?.state?.from === 'forgotPassword' && !displayed && (
        <div>{displayMessage(location?.state?.message)}</div>
      )}
      {location?.state?.from === 'resetPassword' && !displayed && (
        <div>{displayMessage(location?.state?.message)}</div>
      )}
      <div className="sign-in-component-logo">
        <WhyzeTextLogo />
      </div>
      <div className="sign-in-component-title">
        {labelAndTitleConstants.signIn}
      </div>
      <div className="sign-in-component-input-box">
        <Input
          id="main_textbox"
          lable="Company email"
          name={'email'}
          value={email}
          handleInputChange={(e) => handleChange(e)}
          errorText={emailErrorText}
          isError={isEmailError}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="sign-in-component-input-box">
        <Input
          lable={'Enter password'}
          type={!passwordType ? 'password' : 'text'}
          name={'password'}
          value={password}
          suffix={
            !passwordType ? (
              <ShowpassIcon onClick={() => setPasswordType(!passwordType)} />
            ) : (
              <HidePass onClick={() => setPasswordType(!passwordType)} />
            )
          }
          handleInputChange={(e) => handleChange(e)}
          isError={isPasswordError}
          errorText={passwordErrorText}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="sign-in-component-button-group">
        <Button
          handleButtonClick={() => handleSignIn()}
          label={labelAndTitleConstants.signIn}
          size={'large'}
          isLoading={isLoading}
        />
      </div>
      <div>
        {labelAndTitleConstants.forgotPassword}
        <a
          className="sign-in-component-setup-acc-underline"
          onClick={() => navigate('/forgot-password')}
        >
          {labelAndTitleConstants.clickHere}
        </a>
      </div>
    </div>
  );
};

export default SignIn;
