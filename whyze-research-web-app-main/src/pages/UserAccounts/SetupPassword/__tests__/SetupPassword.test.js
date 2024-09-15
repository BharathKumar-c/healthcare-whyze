import React from 'react';
import SetupPassword from '..';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ApiUtil from '../../.././../utils/ApiUtils';
import { BrowserRouter } from 'react-router-dom';
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('../../.././../utils/ApiUtils');

describe('SetupPassword component test', () => {
  test('SnapShot test', () => {
    const { container } = render(<SetupPassword />);
    expect(container).toMatchSnapshot();
  });
  test('password Input value changes', () => {
    const { container } = render(<SetupPassword />);
    const emailInput = container.querySelector('input[name="password"]');
    expect(emailInput.value).toMatch('');
    fireEvent.change(emailInput, { target: { value: 'Test@12345' } });
    expect(emailInput.value).toMatch('Test@12345');
  });

  test('compare two inputs with same value', () => {
    const { container } = render(<SetupPassword />);
    const paswwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector(
      'input[name="confirmPassword"]',
    );
    expect(paswwordInput.value).toMatch('');
    fireEvent.change(paswwordInput, { target: { value: 'Test@12345' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test@12345' } });
    expect(paswwordInput.value).toMatch(confirmPasswordInput.value);
  });

  test('User submit with empty password field', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SetupPassword />
      </BrowserRouter>,
    );
    const paswwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector(
      'input[name="confirmPassword"]',
    );
    const submitButton = getByRole('button');

    fireEvent.change(paswwordInput, { target: { value: '' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test@12345' } });
    fireEvent.click(submitButton);
    const passwordErrorField = getByText('Password must be entered');
    expect(passwordErrorField).toBeInTheDocument();
  });

  test('User submit with less then 8 charater password', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SetupPassword />
      </BrowserRouter>,
    );
    const paswwordInput = container.querySelector('input[name="password"]');

    const submitButton = getByRole('button');

    fireEvent.change(paswwordInput, { target: { value: '1234567' } });
    fireEvent.click(submitButton);
    const passwordErrorField = getByText(
      'Password must be at least 8 characters',
    );
    expect(passwordErrorField).toBeInTheDocument();
  });

  test('User submit without captial,small letter in  password', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SetupPassword />
      </BrowserRouter>,
    );
    const paswwordInput = container.querySelector('input[name="password"]');

    const submitButton = getByRole('button');

    fireEvent.change(paswwordInput, { target: { value: '123456789' } });
    fireEvent.click(submitButton);
    const passwordErrorField = getByText(
      'Password should contain uppercase, lowercase, number and symbol',
    );
    expect(passwordErrorField).toBeInTheDocument();
  });

  test('User submit with empty Confirmpassword field', async () => {
    const { container, getByRole, getByText } = render(
      <BrowserRouter>
        <SetupPassword />
      </BrowserRouter>,
    );
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector(
      'input[name="confirmPassword"]',
    );
    const submitButton = getByRole('button');
    fireEvent.change(passwordInput, { target: { value: 'Test@12345' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '' } });
    fireEvent.click(submitButton);
    const confirmpasswordErrorField = getByText(/Passwords do not match/i);

    expect(confirmpasswordErrorField).toBeInTheDocument();
  });
  test('test change password submit', async () => {
    const { container, getByRole } = render(
      <BrowserRouter>
        <SetupPassword />
      </BrowserRouter>,
    );
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector(
      'input[name="confirmPassword"]',
    );

    fireEvent.change(passwordInput, { target: { value: 'Test@12345' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test@12345' } });

    ApiUtil.forgotPassword.mockResolvedValueOnce({
      message:
        'You will receive a password recovery link at your email address in a few minutes If your email address exists in our system.',
    });
    const submitButton = getByRole('button');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(ApiUtil.forgotPassword).toHaveBeenCalledWith('resetPassword', {
        password: 'Test@12345',
        token: null,
      });
      expect(ApiUtil.forgotPassword).toHaveBeenCalledTimes(1);
      expect(mockedUseNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
