import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignIn from '..';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ApiUtil from '../../../../utils/ApiUtils';
import { RoutesUrls } from '../../../../constant/RoutesUrls';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../../../utils/ApiUtils');

describe('Test cases for sign in', () => {
  test('Create the snapshots for signIn', () => {
    const { container } = render(<SignIn />);
    expect(container).toMatchSnapshot();
  });

  test('Whyze logo renders correctly', () => {
    const { container } = render(<SignIn />);
    const signInTitleText = container.getElementsByClassName(
      'sign-in-component-logo',
    );
    expect(signInTitleText[0].firstChild.textContent).toEqual('WhyzeLogo.svg');
    expect(signInTitleText[0].lastChild.textContent).toEqual('WHYZE');
  });

  test('Sign in title renders correctly', () => {
    const { container } = render(<SignIn />);
    const userTitleText = container.getElementsByClassName(
      'sign-in-component-title',
    );
    expect(userTitleText[0].textContent).toEqual('Sign in');
  });

  test('Check the text input count', () => {
    render(<SignIn />);
    const emailInputFields = screen.getAllByRole('textbox');
    const emailInputField = screen.getByRole('textbox');
    expect(emailInputFields).toHaveLength(1);
    expect(emailInputFields[0]).toBeInTheDocument();
    expect(emailInputField).toBeInTheDocument();
  });

  test('Should password input field renders', () => {
    const { container } = render(<SignIn />);
    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );
    expect(passwordInputFields).toBeInTheDocument();
  });

  test('Should render the Eye icon in password field', () => {
    const { container } = render(<SignIn />);

    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );

    expect(passwordInputFields.value).toMatch('');
    userEvent.type(passwordInputFields, 'test12345');
    expect(passwordInputFields.value).toBe('test12345');
  });

  test('Check the button', () => {
    render(<SignIn />);
    const userTitleText = screen.getAllByRole('button', {
      lable: 'Sign in',
    });
    expect(userTitleText).toHaveLength(1);
    expect(userTitleText[0]).toBeInTheDocument();
  });

  test('forget password text renders successFully!', () => {
    const { container } = render(<SignIn />);
    const forgetPasswordText = container.getElementsByClassName(
      'sign-in-component-setup-acc-underline',
    );
    expect(forgetPasswordText[0].textContent).toEqual('Forgot Password');
  });

  test('Set account text renders successFully!', () => {
    render(<SignIn />);
    const setUpAccountText = screen.getByRole('heading', {}, { level: 3 });
    expect(setUpAccountText).toBeInTheDocument();
  });

  test('Signin page to forgot-passowrd navigation', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    userEvent.click(screen.getByText(/Forgot Password/i));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/forgot-password');
  });

  test('Signin page to setUp-account navigation', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    expect(screen.getByText('Set up account')).toBeInTheDocument();
    userEvent.click(screen.getByText(/Set up account/i));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      RoutesUrls.createAccountUrl,
    );
  });

  test('Should eye icon cirrectly', () => {
    const { container } = render(<SignIn />);
    screen.debug();
    const showpassIcon = container.getElementsByClassName('ant-input-suffix');

    expect(showpassIcon[0]).toBeInTheDocument();
    expect(showpassIcon[0].textContent).toEqual('ShowpassIcon.svg');
    fireEvent.click(showpassIcon[0].firstChild);
    expect(showpassIcon[0].textContent).toEqual('HidePass.svg');
    fireEvent.click(showpassIcon[0].firstChild);
    expect(showpassIcon[0].textContent).toEqual('ShowpassIcon.svg');
  });

  test('User sign in with empty email and passowrd field', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );
    const submitButton = getByRole('button', { name: 'Sign in' });
    fireEvent.change(emailInput, '');
    fireEvent.change(passwordInputFields, '');
    userEvent.click(submitButton);
    const emailErrorField = getByText('Email address must be entered');
    const passwordErrorField = getByText('Password must be entered');
    expect(emailErrorField).toBeInTheDocument();
    expect(passwordErrorField).toBeInTheDocument();
  });
  test('User sign in with empty email field', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );
    const submitButton = getByRole('button', { name: 'Sign in' });
    fireEvent.change(emailInput, '');
    userEvent.type(passwordInputFields, 'test12345');
    userEvent.click(submitButton);
    const emailErrorField = getByText('Email address must be entered');
    expect(emailErrorField).toBeInTheDocument();
  });
  test('User sign in with empty password field', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );
    const submitButton = getByRole('button', { name: 'Sign in' });
    userEvent.type(emailInput, 'Test@testmail.com');
    fireEvent.change(passwordInputFields, '');
    userEvent.click(submitButton);
    const passwordErrorField = getByText('Password must be entered');
    expect(passwordErrorField).toBeInTheDocument();
  });
  test('User sign in with invalid email', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );
    const submitButton = getByRole('button', { name: 'Sign in' });
    userEvent.type(emailInput, 'Testtestmail.com');
    userEvent.type(passwordInputFields, 'test12345');
    userEvent.click(submitButton);
    const emailErrorField = getByText('Enter valid email address');
    expect(emailErrorField).toBeInTheDocument();
  });
  test('User sign in', async () => {
    const { container, getByRole } = render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );
    ApiUtil.loginUser.mockResolvedValueOnce({
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3aHl6ZSIsImVtYWlsIjoia2FydGhpa0BpdGVyby5pZSIsInVzZXJJRCI6IjAwMDc5Yzg2LTc1MjktNDY4NC1iOGNlLTQ1NDM0NjY0NWFiOCIsImlhdCI6MTY3NTc0OTg5NywiZXhwIjoxNjc1NzUzNDk3fQ.IcA7_XbweQFScijf9rdPDPn93uv4Uj6CMFVZILOfXmw',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3aHl6ZSIsImVtYWlsIjoia2FydGhpa0BpdGVyby5pZSIsInVzZXJJRCI6IjAwMDc5Yzg2LTc1MjktNDY4NC1iOGNlLTQ1NDM0NjY0NWFiOCIsImlhdCI6MTY3NTc0OTg5NywiZXhwIjoxNjc1ODM2Mjk3fQ.B83W0J4LvEUAw5QtXOE_6XZ3AVh0L3LuWAqhsf92wLc',
    });
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInputFields = container.querySelector(
      'input[name="password"]',
    );
    const submitButton = getByRole('button', { name: 'Sign in' });
    userEvent.type(emailInput, 'Test@testmail.com');
    userEvent.type(passwordInputFields, 'Test12345');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(ApiUtil.loginUser).toHaveBeenCalledWith('login', {
        email: 'Test@testmail.com',
        password: 'Test12345',
      });
      expect(ApiUtil.loginUser).toHaveBeenCalledTimes(1);
      expect(mockedUsedNavigate).toHaveBeenCalledWith(RoutesUrls.dashBoardUrl);
    });
  });
});
