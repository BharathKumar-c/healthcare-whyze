import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';
import FooterNewFeasibilityStudy from '..';
import userEvent from '@testing-library/user-event';
import { SaveAndCloseModalConst } from '../../../../constant/ConstantTexts';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import ApiUtil from '../../../../utils/ApiUtils';

const mockedUsedNavigate = jest.fn();

jest.mock('../../../../utils/ApiUtils');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

function addTabsAndNextTabs(tabs, activeTab) {
  const newSegments = JSON.parse(
    JSON.stringify(store.getState().feasibilityStudyReducer.segments),
  );
  const { activeSegment } = JSON.parse(
    JSON.stringify(store.getState().feasibilityStudyReducer),
  );
  newSegments[activeSegment.index].activeTab = activeTab;
  newSegments[activeSegment.index].tabs = tabs;

  store.dispatch(setSegments(newSegments));
}

describe('Test cases for new feasibility study footer', () => {
  test('Create the snapshots for new feasibility study footer', () => {
    const { container } = renderWithContext(<FooterNewFeasibilityStudy />);

    expect(container).toMatchSnapshot();
  });

  test('Should render the close button correcly', () => {
    renderWithContext(<FooterNewFeasibilityStudy />);
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons[0];
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.textContent).toBe('Cancel');
  });

  test('Should render the save and close button correcly', () => {
    renderWithContext(<FooterNewFeasibilityStudy />);
    const buttons = screen.getAllByRole('button');
    const saveAndCloseButton = buttons[1];
    expect(saveAndCloseButton).toBeInTheDocument();
    expect(saveAndCloseButton.textContent).toBe('Save and close');
    userEvent.click(saveAndCloseButton);
    const whyzeLogo = screen.getByAltText('modal-title-logo');
    const titleText = screen.getByText(
      SaveAndCloseModalConst.SaveAndCloseModalTitle,
    );
    expect(whyzeLogo).toBeInTheDocument();
    expect(titleText).toBeInTheDocument();
  });

  test('Should render the next button correcly', () => {
    renderWithContext(<FooterNewFeasibilityStudy />);
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[2];
    expect(nextButton).toBeInTheDocument();
    expect(nextButton.textContent).toBe('Next');
  });

  test('Check the next button onclick function', () => {
    renderWithContext(<FooterNewFeasibilityStudy />);
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[2];

    userEvent.click(nextButton);
    const { segments, activeSegment } =
      store.getState().feasibilityStudyReducer;

    expect(segments[activeSegment.index]?.tabs[1]).toEqual({
      name: 'location',
      title: 'Location',
      isActive: true,
      position: 'left',
    });
  });

  test('Check the next button function when the next tab is already created', () => {
    const activeTab = {
      name: 'feasibility',
      index: 0,
    };
    const tabs = [
      {
        name: 'feasibility',
        title: 'Feasibility',
        isActive: true,
        position: 'left',
      },
      {
        name: 'location',
        title: 'Location',
        isActive: false,
        position: 'left',
      },
    ];
    addTabsAndNextTabs(tabs, activeTab);
    const { store } = renderWithContext(<FooterNewFeasibilityStudy />);

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[2];

    userEvent.click(nextButton);
    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );

    expect(segments[activeSegment.index]?.tabs[1]).toEqual({
      name: 'location',
      title: 'Location',
      isActive: true,
      position: 'left',
    });
  });

  test('Should render the sites tab when click the next button in location tab', () => {
    const { store } = renderWithContext(<FooterNewFeasibilityStudy />);

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[2];
    userEvent.click(nextButton);

    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );

    expect(segments[activeSegment.index]?.tabs[1]).toEqual({
      name: 'location',
      title: 'Location',
      isActive: false,
      position: 'left',
    });

    expect(segments[activeSegment.index]?.tabs[2]).toEqual({
      name: 'sites',
      title: 'Sites',
      isActive: true,
      position: 'left',
    });
  });

  test('Should render the preferred List tab when click the next button in sites tab', () => {
    const { store } = renderWithContext(<FooterNewFeasibilityStudy />);

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[2];
    userEvent.click(nextButton);

    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );

    expect(segments[activeSegment.index]?.tabs[1]).toEqual({
      name: 'location',
      title: 'Location',
      isActive: false,
      position: 'left',
    });

    expect(segments[activeSegment.index]?.tabs[2]).toEqual({
      name: 'sites',
      title: 'Sites',
      isActive: false,
      position: 'left',
    });

    expect(segments[activeSegment.index]?.tabs[3]).toEqual({
      name: 'preferredList',
      title: 'PreferredList',
      isActive: true,
      position: 'left',
    });
  });

  test('Check the onClose fuction in save and close modal when click the x icon', async () => {
    renderWithContext(<FooterNewFeasibilityStudy />);

    const buttons = screen.getAllByRole('button');
    const saveAndCloseButton = buttons[1];
    expect(saveAndCloseButton).toBeInTheDocument();
    expect(saveAndCloseButton.textContent).toBe('Save and close');
    userEvent.click(saveAndCloseButton);

    const allButtons = screen.getAllByRole('button');

    const closeButton = allButtons[3];
    expect(closeButton).toBeInTheDocument();
  });

  test('Check the onClose fuction in save and close modal when click the cancel button', async () => {
    renderWithContext(<FooterNewFeasibilityStudy />);

    const buttons = screen.getAllByRole('button');
    const saveAndCloseButton = buttons[1];
    expect(saveAndCloseButton).toBeInTheDocument();
    expect(saveAndCloseButton.textContent).toBe('Save and close');
    userEvent.click(saveAndCloseButton);

    const allButtons = screen.getAllByRole('button');

    const cancelButton = allButtons[4];
    userEvent.click(cancelButton);
    expect(cancelButton).toBeInTheDocument();
  });

  test('Check the handleSave fuction in save and close modal when click the save button', async () => {
    renderWithContext(<FooterNewFeasibilityStudy />);

    ApiUtil.postData.mockResolvedValue({
      data: {
        message: 'Project stored successfully!',
      },
    });
    const buttons = screen.getAllByRole('button');
    const saveAndCloseButton = buttons[1];
    expect(saveAndCloseButton).toBeInTheDocument();
    expect(saveAndCloseButton.textContent).toBe('Save and close');
    userEvent.click(saveAndCloseButton);

    const inputFields = screen.getAllByRole('textbox');

    expect(inputFields[0]).toBeInTheDocument();
    expect(inputFields[0]).toHaveAttribute('name', 'projectName');
    userEvent.type(inputFields[0], 'test');

    expect(inputFields[1]).toBeInTheDocument();
    expect(inputFields[1]).toHaveAttribute('name', 'clientName');
    userEvent.type(inputFields[1], 'Sponser');

    expect(inputFields[2]).toBeInTheDocument();
    expect(inputFields[2]).toHaveAttribute('name', 'description');
    userEvent.type(inputFields[2], 'description');

    const projectInputField = screen.getByRole('spinbutton');
    fireEvent.change(projectInputField, { target: { value: 123 } });

    const allButtons = screen.getAllByRole('button');

    const saveButton = allButtons[5];
    expect(saveButton).toBeInTheDocument();

    userEvent.click(saveButton);

    await waitFor(() => {
      expect(ApiUtil.postData).toHaveBeenCalledTimes(1);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('Check the handleSave fuction in save and close modal when click the save button', async () => {
    renderWithContext(<FooterNewFeasibilityStudy />);

    const buttons = screen.getAllByRole('button');
    const saveAndCloseButton = buttons[1];
    expect(saveAndCloseButton).toBeInTheDocument();
    expect(saveAndCloseButton.textContent).toBe('Save and close');
    userEvent.click(saveAndCloseButton);

    const inputFields = screen.getAllByRole('textbox');

    expect(inputFields[0]).toBeInTheDocument();
    expect(inputFields[0]).toHaveAttribute('name', 'projectName');
    fireEvent.change(inputFields[0], '');

    expect(inputFields[1]).toBeInTheDocument();
    expect(inputFields[1]).toHaveAttribute('name', 'clientName');
    userEvent.type(inputFields[1], 'Sponser');

    expect(inputFields[2]).toBeInTheDocument();
    expect(inputFields[2]).toHaveAttribute('name', 'description');
    userEvent.type(inputFields[2], 'description');

    const projectInputField = screen.getByRole('spinbutton');
    fireEvent.change(projectInputField, { target: { value: 123 } });

    const allButtons = screen.getAllByRole('button');

    const saveButton = allButtons[5];
    expect(saveButton).toBeInTheDocument();

    userEvent.click(saveButton);

    const projectInputErrorText = screen.getByText(
      'Please enter valid projectName',
    );

    expect(projectInputErrorText).toBeInTheDocument();
  });
});
