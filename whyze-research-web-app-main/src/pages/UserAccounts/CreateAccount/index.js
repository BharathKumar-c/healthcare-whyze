import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLogo, ShowpassIcon, UnChecked, HidePass } from '../../../assets';
import { Button, Input, Select } from '../../../components/basic';
import { countrySelect, emailValidationRegex } from '../../../constant';
import { authEndPoints } from '../../../constant/ApiEndPoints';
import { createAccountContants } from '../../../constant/ConstantTexts';
import ApiUtil from '../../../utils/ApiUtils';

import './CreateAccount.scss';
import { RoutesUrls } from '../../../constant/RoutesUrls';

const CreateAccount = () => {
  const [captialLetter, setCaptialLetter] = useState(false);
  const [smallLetter, setSmallLetter] = useState(false);
  const [numberic, setNumberic] = useState(false);
  const [charaterLength, setcharaterLength] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+353',
    password: '',
  });
  const [emailError, setEmailError] = useState({
    isError: false,
    errorText: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const value = e.target.value;

    if (RegExp('(?=.*[a-z])').test(e.target.value)) {
      setSmallLetter(true);
    } else {
      setSmallLetter(false);
    }
    if (RegExp('(?=.*[A-Z])').test(value)) {
      setCaptialLetter(true);
    } else {
      setCaptialLetter(false);
    }
    if (RegExp('(?=.*[0-9])').test(value)) {
      setNumberic(true);
    } else {
      setNumberic(false);
    }
    if (RegExp('(?=.{8,20})').test(value)) {
      setcharaterLength(true);
    } else {
      setcharaterLength(false);
    }
    setUserDetails((previousState) => ({
      ...previousState,
      password: value,
    }));
  };
  const handleSelect = (value) => {
    setUserDetails((previousState) => ({
      ...previousState,
      countryCode: value,
    }));
  };

  const handleChangeName = (e) => {
    const { value, name } = e.target;
    if (name === 'email') {
      setEmailError({
        isError: !value.match(emailValidationRegex),
        errorText: !value.match(emailValidationRegex) ? 'Invalid email' : '',
      });
    }
    setUserDetails((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    await ApiUtil.register(authEndPoints.register, userDetails)
      .then(() => {
        setIsLoading(false);
        navigate(RoutesUrls.loginUrl);
      })
      .catch((err) => {
        setIsLoading(false);
        setEmailError({
          isError: true,
          errorText: err,
        });
      });
  };

  return (
    <div className="create-account-container">
      <div className="create-account-container_content">
        <div className="create-account-container_header">
          <div data-testid="logo_img">
            <MainLogo />
          </div>
          <h1>{createAccountContants.createAccounTitle}</h1>
        </div>
        <div>
          <Input
            id="create-account-container-name"
            lable={createAccountContants.nameLabel}
            name={'name'}
            handleInputChange={handleChangeName}
          />
          <Input
            className=""
            id="create-account-container-email"
            lable={createAccountContants.emailLabel}
            type={'email'}
            name={'email'}
            handleInputChange={handleChangeName}
            isError={emailError.isError}
            errorText={emailError.errorText}
          />
          <div className="Phonenumber_header">
            <h3 className="Phonenumber_header_label">
              {createAccountContants.phoneLabel}&nbsp;&nbsp;
              <p>{' (optional)'}</p>
            </h3>
          </div>
          <div className="phonenumber-panel">
            <Select
              options={countrySelect}
              defaultValue={countrySelect[0].value}
              handleSelect={handleSelect}
              className="phone-number-select"
            />
            <Input
              id="create-account-container-phone"
              type={'number'}
              name={'phone'}
              placeholder={'E.g 1234567'}
              width={320}
              handleInputChange={handleChangeName}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <Input
            id="create-account-container-password"
            lable={createAccountContants.passwordLabel}
            type={passwordType}
            name={'password'}
            suffix={
              <div
                className="create-account-container-password-icon"
                onClick={() =>
                  passwordType === 'password'
                    ? setPasswordType('text')
                    : setPasswordType('password')
                }
              >
                {passwordType === 'password' ? <ShowpassIcon /> : <HidePass />}
              </div>
            }
            handleInputChange={(e) => handleChange(e)}
          />
        </div>

        <div
          className="create-account-container_Rules"
          id="create-account-container_Rules"
        >
          <div className="rules_elemets">
            {!charaterLength ? (
              <UnChecked />
            ) : (
              <UnChecked className="checked_icon " />
            )}
            <p>{createAccountContants.characterLengthLabel}</p>
          </div>
          <div className="rules_elemets">
            {!numberic ? (
              <UnChecked />
            ) : (
              <UnChecked className="checked_icon " />
            )}
            <p>{createAccountContants.numericLabel}</p>
          </div>
          <div className="rules_elemets">
            {!captialLetter ? (
              <UnChecked />
            ) : (
              <UnChecked className="checked_icon " />
            )}
            <p>{createAccountContants.uppercaseLabel}</p>
          </div>
          <div className="rules_elemets">
            {!smallLetter ? (
              <UnChecked />
            ) : (
              <UnChecked className="checked_icon " />
            )}
            <p>{createAccountContants.lowercaseLabel}</p>
          </div>
        </div>

        <Button
          label={createAccountContants.createAccountButtonLabel}
          className="create_account_btn"
          isLoading={isLoading}
          handleButtonClick={handleCreateAccount}
          disabled={
            !(captialLetter && smallLetter && numberic && charaterLength)
          }
        />

        <div className="create-account-container_Terms">
          <p>
            {createAccountContants.agreeConditionText}{' '}
            <a
              href="https://www.whyzehealth.com/terms"
              rel="noreferrer"
              target="_blank"
            >
              {createAccountContants.termsOfUseText}
            </a>
            &nbsp;and&nbsp;
            <a
              href="https://www.whyzehealth.com/privacy-notice/"
              rel="noreferrer"
              target="_blank"
            >
              {createAccountContants.privacyNoticesText}
            </a>
          </p>
          <h3>
            {createAccountContants.alreadyHaveAccountText}&nbsp;
            <a
              data-testid="Login"
              onClick={() => navigate(RoutesUrls.loginUrl)}
            >
              {createAccountContants.loginText}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
