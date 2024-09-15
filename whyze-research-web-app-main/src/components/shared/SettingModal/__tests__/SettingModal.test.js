import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';
import React from 'react';
import SettingModal from '..';

function renderWithContext(element) {
  const { container, getByText, getByRole } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText, getByRole };
}
const openModal = {
  isOpen: true,
  isSubComp: false,
  page: 'new-feasibility-study',
  title: 'Project settings',
};
const ProjectShareLinknotSub = {
  isOpen: true,
  isSubComp: false,
  page: 'new-feasibility-study',
  title: 'Share project link',
};
const openModalProjectSettingsIsSub = {
  isOpen: true,
  isSubComp: true,
  page: 'new-feasibility-study',
  title: 'Share project link',
};

describe('create test cases for ProjectSettings', () => {
  test('should trigger handle share', () => {
    const handleclick = jest.fn();
    const setOpenModal = jest.fn();
    renderWithContext(
      <SettingModal openModal={openModal} setOpenModal={setOpenModal} />,
    );
    const submitButton = screen.getByTestId('share-button');
    fireEvent.click(submitButton);
    expect(handleclick).toBeCalledTimes(0);
  });
  test('should trigger ProjectShareLinknotSub', () => {
    const { container } = renderWithContext(
      <SettingModal openModal={ProjectShareLinknotSub} />,
    );
    expect(container).toBeInTheDocument();
  });

  test('should handleclick share trigger while click Share project link', () => {
    const openModal = jest.fn();
    const { container, getByRole } = renderWithContext(
      <SettingModal
        openModal={openModalProjectSettingsIsSub}
        setOpenModal={openModal}
      />,
    );

    const submitButton = getByRole('button', { name: 'Send' });
    fireEvent.click(submitButton);
    expect(container).toBeInTheDocument();
  });
  test('should handleBack trigger in  Share project link child', () => {
    const openModal = jest.fn();

    const { container } = renderWithContext(
      <SettingModal
        openModal={openModalProjectSettingsIsSub}
        setOpenModal={openModal}
      />,
    );
    const Title = screen.getByText(/Share project link/i);
    const Back = screen.getByText(/BackArrow/i);
    expect(Title.textContent).toBe('Share project link');
    fireEvent.click(Back);
    expect(container).toBeInTheDocument();
  });
});
