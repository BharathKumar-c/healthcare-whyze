import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgotPassword from '..';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ApiUtil from '../../.././../utils/ApiUtils';
import { RoutesUrls } from '../../../../constant/RoutesUrls';
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));
jest.mock('../../.././../utils/ApiUtils');

describe('ForgotPassword component tests', () => {
  test('Snapshot test', () => {
    const { container } = render(<ForgotPassword />);
    expect(container).toMatchSnapshot();
  });

  test('Input email value changes', () => {
    const { container } = render(<ForgotPassword />);
    const emailInput = container.querySelector('input[name="email"]');
    expect(emailInput.value).toMatch('');
    fireEvent.change(emailInput, { target: { value: 'Test@testmail.com' } });
    expect(emailInput.value).toMatch('Test@testmail.com');
  });

  test('Submit form', async () => {
    const { container, getByRole } = render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>,
    );
    const emailInput = container.querySelector('input[name="email"]');
    const ButtonTrigger = getByRole('button', { name: 'Send Reset Link' });
    userEvent.type(emailInput, 'Test@testmail.com');
    userEvent.click(ButtonTrigger);

    ApiUtil.forgotPassword.mockResolvedValueOnce({
      message:
        'You will receive a password recovery link at your email address in a few minutes If your email address exists in our system.',
    });
    const submitButton = getByRole('button');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(ApiUtil.forgotPassword).toHaveBeenCalledWith(
        'sendResetPasswordLink',
        {
          email: 'Test@testmail.com',
        },
      );

      expect(mockedUseNavigate).toHaveBeenCalledWith(
        `/${RoutesUrls.setupPasswordUrl}`,
      );
    });
  });

  test('Whyze logo and text', () => {
    const { container } = render(<ForgotPassword />);
    const whyzeLogoText = container.getElementsByClassName(
      'forgot-password-component-logo',
    );
    expect(whyzeLogoText.length).toBe(1);
    expect(whyzeLogoText[0].firstChild.textContent).toEqual('WhyzeLogo.svg');
    expect(whyzeLogoText[0].lastChild.textContent).toEqual('WHYZE');
  });

  test('Forgot password title', () => {
    const { container } = render(<ForgotPassword />);
    const title = container.getElementsByClassName(
      'forgot-password-component-title',
    );

    expect(title.length).toBe(1);
    expect(title[0].firstChild.textContent).toEqual('Forgot Password');
  });

  test('Description text', () => {
    const { container } = render(<ForgotPassword />);
    const description = container.getElementsByClassName(
      'forgot-password-component-description',
    );

    expect(description.length).toBe(1);
    expect(description[0].firstChild.textContent).toEqual(
      'Enter your email below and we will send you a reset email.',
    );
  });

  test('Signin page to setUp-account rendering/navigating', () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>,
    );
    expect(
      screen.getByText(
        'Enter your email below and we will send you a reset email.',
      ),
    ).toBeInTheDocument();
    userEvent.click(screen.getByText(/Login/i));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/');
  });
  test('should empty email send its shows error message', () => {
    const { container, getByRole } = render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>,
    );
    const emailInput = container.querySelector('input[name="email"]');
    fireEvent.change(emailInput, '');
    const submitButton = getByRole('button');
    fireEvent.click(submitButton);
    expect(container).toBeInTheDocument();
  });
  test('should verify email when submit', () => {
    const { container, getByRole } = render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>,
    );
    const emailInput = container.querySelector('input[name="email"]');
    userEvent.type(emailInput, 'Test@');
    const submitButton = getByRole('button');
    fireEvent.click(submitButton);
    expect(container).toBeInTheDocument();
  });
});
