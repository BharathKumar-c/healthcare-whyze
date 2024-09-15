import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PropTypes from 'prop-types';
const mockedUsedNavigate = jest.fn();
import Store from '../../../../redux/store';
import { Provider } from 'react-redux';
import CreateAccount from '..';
import { createAccountContants } from '../../../../constant/ConstantTexts';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ApiUtil from '../../../../utils/ApiUtils';
import { RoutesUrls } from '../../../../constant/RoutesUrls';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('axios');

jest.mock('../../../../utils/ApiUtils');

const Wrapper = ({ children }) => (
  // you could just use your normal Redux store or create one just for the test
  <Provider store={Store}>{children}</Provider>
);

describe('Unit test case for Create account', () => {
  test('renders correctly', () => {
    render(<CreateAccount />);
    expect(screen).toMatchSnapshot();
    expect(screen.getByTestId('logo_img')).toBeInTheDocument();

    const titleElement = screen.getByRole('heading', {
      name: createAccountContants.setUpWhyzeAccount,
    });
    expect(titleElement).toBeInTheDocument();

    const phonenumberHeadingElement = screen.getByRole('heading', {
      name: `${createAccountContants.phoneLabel} (optional)`,
    });
    expect(phonenumberHeadingElement).toBeInTheDocument();

    const alreadyHaveAccountElement = screen.getByRole('heading', {
      name: `${createAccountContants.alreadyHaveAccountText} ${createAccountContants.loginText}`,
    });
    expect(alreadyHaveAccountElement).toBeInTheDocument();

    const countryCodeElement = screen.getByRole('combobox');
    expect(countryCodeElement).toBeInTheDocument();

    const phoneNUmberTextBoxElement = screen.getByRole('spinbutton');
    expect(phoneNUmberTextBoxElement).toBeInTheDocument();

    const termsElement = screen.getByRole('link', {
      name: createAccountContants.termsOfUseText,
    });
    expect(termsElement).toBeInTheDocument();
    expect(termsElement).toHaveAttribute(
      'href',
      createAccountContants.termsOfUseLink,
    );

    const policyElements = screen.getByRole('link', {
      name: createAccountContants.privacyNoticesText,
    });
    expect(policyElements).toBeInTheDocument();
    expect(policyElements).toHaveAttribute(
      'href',
      createAccountContants.privacyNoticesLink,
    );

    const createAccountButtonElement = screen.getByRole('button');
    expect(createAccountButtonElement).toBeInTheDocument();

    expect(
      screen.getByTestId('create-account-container-name'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('create-account-container-email'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('create-account-container-phone'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('create-account-container-password'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(createAccountContants.characterLengthLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(createAccountContants.numericLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(createAccountContants.uppercaseLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(createAccountContants.lowercaseLabel),
    ).toBeInTheDocument();
  });

  test('Should onchange ', () => {
    const { container } = render(<CreateAccount />);
    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const phoneInput = container.querySelector('input[name="phone"]');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(emailInput, { target: { value: 'Test@testmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin@123' } });
    fireEvent.change(phoneInput, { target: { value: '9999999999' } });
    expect(nameInput.value).toBe('Test');
    expect(emailInput.value).toBe('Test@testmail.com');
    expect(passwordInput.value).toBe('Admin@123');
    expect(phoneInput.value).toBe('9999999999');
  });

  test('login navigation', () => {
    render(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>,
    );
    expect(screen.getByTestId('Login')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('Login'));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });
  test('submit button disabled when all the required fields needed', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>,
    );
    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = getByRole('button');
    userEvent.type(nameInput, '');
    userEvent.type(emailInput, '');
    userEvent.type(passwordInput, '');
    userEvent.click(submitButton);

    expect(
      getByText(createAccountContants.createAccountButtonLabel).closest(
        'button',
      ),
    ).toHaveAttribute('disabled');
  });

  test('Should render the Eye icon in password field', () => {
    const { container } = render(<CreateAccount />);

    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );
    screen.debug(passwordInputFields);
    expect(passwordInputFields.value).toMatch('');
    userEvent.type(passwordInputFields, 'test12345');
    expect(passwordInputFields.value).toBe('test12345');

    const eyeElement = container.getElementsByClassName(
      'create-account-container-password-icon',
    );
    userEvent.click(eyeElement[0]);
    expect(passwordInputFields).toHaveAttribute('type', 'text');

    const eyeTextElement = container.getElementsByClassName(
      'create-account-container-password-icon',
    );
    userEvent.click(eyeTextElement[0]);
    expect(passwordInputFields).toHaveAttribute('type', 'password');
  });

  test('Create Account API - Success', async () => {
    const { container, getByRole } = render(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>,
    );
    ApiUtil.register.mockResolvedValueOnce({
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3aHl6ZSIsImVtYWlsIjoia2FydGhpa0BpdGVyby5pZSIsInVzZXJJRCI6IjAwMDc5Yzg2LTc1MjktNDY4NC1iOGNlLTQ1NDM0NjY0NWFiOCIsImlhdCI6MTY3NTc0OTg5NywiZXhwIjoxNjc1NzUzNDk3fQ.IcA7_XbweQFScijf9rdPDPn93uv4Uj6CMFVZILOfXmw',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3aHl6ZSIsImVtYWlsIjoia2FydGhpa0BpdGVyby5pZSIsInVzZXJJRCI6IjAwMDc5Yzg2LTc1MjktNDY4NC1iOGNlLTQ1NDM0NjY0NWFiOCIsImlhdCI6MTY3NTc0OTg5NywiZXhwIjoxNjc1ODM2Mjk3fQ.B83W0J4LvEUAw5QtXOE_6XZ3AVh0L3LuWAqhsf92wLc',
    });
    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const countryCodeInput = getByRole('combobox');
    const phoneInput = container.querySelector('input[name="phone"]');
    const submitButton = getByRole('button');
    userEvent.type(nameInput, 'Test');
    userEvent.type(emailInput, 'Test@testmail.com');
    userEvent.type(passwordInput, 'Admin@123');
    userEvent.type(countryCodeInput, '+353');
    userEvent.type(phoneInput, '9999999999' || '');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(ApiUtil.register).toHaveBeenCalledWith('register', {
        name: 'Test',
        email: 'Test@testmail.com',
        password: 'Admin@123',
        phone: '9999999999' || '',
        countryCode: '+353',
      });
      expect(ApiUtil.register).toHaveBeenCalledTimes(1);
      expect(mockedUsedNavigate).toHaveBeenCalledWith(RoutesUrls.loginUrl);
    });
  });
});

Wrapper.propTypes = {
  children: PropTypes.node,
};

Wrapper.defaultProps = {
  children: null,
};
