import React from 'react';
import { fireEvent, logRoles, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

import store from '../../../../../redux/store';
import SaveAndCloseModal from '..';
import {
  cancelButtonLabel,
  SaveAndCloseModalConst,
  saveButtonLabel,
} from '../../../../../constant/ConstantTexts';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

const handleInputChange = jest.fn();

describe('Test cases for save and close modal', () => {
  test('Create the snapshots for save and close modal', () => {
    const { container } = renderWithContext(
      <SaveAndCloseModal openModal={true} />,
    );

    expect(container).toMatchSnapshot();
  });

  test('Should render the close button Correctly', () => {
    const handleClose = jest.fn();
    renderWithContext(
      <SaveAndCloseModal openModal={true} handleClose={handleClose} />,
    );
    const closeButton = screen.getAllByRole('button');
    userEvent.click(closeButton[0]);
    expect(handleClose).toBeCalledTimes(1);
  });

  test('Should render the title correctly', () => {
    renderWithContext(<SaveAndCloseModal openModal={true} />);

    const whyzeLogo = screen.getByAltText('modal-title-logo');
    const titleText = screen.getByText(
      SaveAndCloseModalConst.SaveAndCloseModalTitle,
    );
    expect(whyzeLogo).toBeInTheDocument();
    expect(titleText).toBeInTheDocument();
  });

  test('Should render the project name input field correctly', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        handleInputChange={handleInputChange}
      />,
    );
    const projectInputField = screen.getAllByRole('textbox');

    expect(projectInputField[0]).toBeInTheDocument();
    expect(projectInputField[0]).toHaveAttribute('name', 'projectName');
    userEvent.type(projectInputField[0], 'test');
    expect(projectInputField[0].value).toBe('test');
  });

  test('Should render the error message when the project field is empty', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        errors={{
          key: 'projectName',
          errors: 'Please enter valid projectName',
        }}
      />,
    );

    const errorMessage = screen.getByText('Please enter valid projectName');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Should render the client name input field correctly', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        handleInputChange={handleInputChange}
      />,
    );
    const clientNameInputField = screen.getAllByRole('textbox');

    expect(clientNameInputField[1]).toBeInTheDocument();
    expect(clientNameInputField[1]).toHaveAttribute('name', 'clientName');
    userEvent.type(clientNameInputField[1], 'Sponser');
    expect(clientNameInputField[1].value).toBe('Sponser');
  });

  test('Should render the error message when the client name field is empty', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        errors={{
          key: 'clientName',
          errors: 'Please enter valid clientName',
        }}
      />,
    );

    const errorMessage = screen.getByText('Please enter valid clientName');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Should render the description text area field correctly', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        handleInputChange={handleInputChange}
      />,
    );
    const descriptionInputField = screen.getAllByRole('textbox');

    expect(descriptionInputField[2]).toBeInTheDocument();
    expect(descriptionInputField[2]).toHaveAttribute('name', 'description');
    userEvent.type(descriptionInputField[2], 'description');
    expect(descriptionInputField[2].value).toBe('description');
  });

  test('Should render the error message when the description field is empty', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        errors={{
          key: 'description',
          errors: 'Please enter valid description',
        }}
      />,
    );

    const errorMessage = screen.getByText('Please enter valid description');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Should render the patient required input field correctly', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        handleInputChange={handleInputChange}
      />,
    );
    const projectInputField = screen.getByRole('spinbutton');
    fireEvent.change(projectInputField, { target: { value: 123 } });
    expect(projectInputField.value).toBe('123');
  });

  test('Should render the error message when the patient required field is empty', () => {
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        errors={{
          key: 'patientSegmentReqiured',
          errors: 'Please enter valid patientSegmentReqiured',
        }}
      />,
    );

    const errorMessage = screen.getByText(
      'Please enter valid patientSegmentReqiured',
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test('Should render the save button correctly', async () => {
    const handleClose = jest.fn();
    const handleSave = jest.fn();
    renderWithContext(
      <SaveAndCloseModal
        openModal={true}
        handleClose={handleClose}
        handleSave={handleSave}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const saveButton = buttons[2];
    const cancelButton = buttons[1];

    expect(saveButton).toBeInTheDocument();
    expect(saveButton.textContent).toBe(saveButtonLabel);

    fireEvent.click(saveButton);
    expect(handleSave).toBeCalledTimes(1);
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton.textContent).toBe(cancelButtonLabel);
    fireEvent.click(cancelButton);
    expect(handleClose).toBeCalledTimes(1);
  });
});
