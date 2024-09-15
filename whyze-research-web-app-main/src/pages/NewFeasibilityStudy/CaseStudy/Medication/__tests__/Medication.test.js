import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';

import Medication from '../index';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../../../redux/store';
import { medicationConstants } from '../../../../../constant/ConstantTexts';
import ApiUtil from '../../../../../utils/ApiUtils';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

jest.mock('../../../../../utils/ApiUtils');

const caseDetails = {
  name: 'Medication',
  case: 'Medication',
  condition: 'Inclusion',
  caseName: '',
  child: [],
};

describe('Test cases for medication', () => {
  test('Create the snapshots for Medication', () => {
    const { container } = renderWithContext(<Medication />);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy.push(caseDetails);
      store.dispatch(setSegments(segments));
    });

    expect(container).toMatchSnapshot();
  });

  test('Should render the input field correctly', async () => {
    renderWithContext(<Medication />);
    ApiUtil.getData.mockResolvedValue({
      data: { result: [{ Name: 'Abstral 100 microgram sublingual tablets' }] },
    });
    const inputField = screen.getByRole('combobox');

    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toMatch('');

    fireEvent.change(inputField, {
      target: { value: 'Abst' },
    });
    expect(inputField.value).toMatch('Abst');

    await waitFor(() => {
      expect(ApiUtil.getData).toHaveBeenCalledWith(
        'search/medication?value=Abst',
      );
    });
  });

  test('Should show the Enter 3 or more Characters text when casename has less than three letters', () => {
    renderWithContext(<Medication />);

    const inputField = screen.getByRole('combobox');

    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toMatch('');

    fireEvent.change(inputField, {
      target: { value: 'Ab' },
    });

    const contentText = screen.getByText('Enter 3 or more Characters');
    expect(contentText).toBeInTheDocument();
  });

  test('Should render the Add icon correctly', () => {
    renderWithContext(<Medication />);

    const addIcon = screen.getByAltText('medication-add-icon');
    expect(addIcon).toBeInTheDocument();
  });

  test('Should render error text when click add icon without caseName correctly', () => {
    renderWithContext(<Medication caseDetails={caseDetails} />);

    const addIcon = screen.getByAltText('medication-add-icon');
    fireEvent.click(addIcon);

    const errorText = screen.getByText(
      medicationConstants.medicationConditionErrorMessage,
    );
    expect(errorText).toBeInTheDocument();
  });

  test('Should render when click add icon with caseName correctly', async () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: 'Abstral 100 microgram sublingual tablets',
      child: [],
    };

    const handleAddCondition = jest.fn();
    renderWithContext(
      <Medication
        caseDetails={caseDetailsWithCaseName}
        parentIndex={2}
        handleAddCondition={handleAddCondition}
      />,
    );

    const addIcon = screen.getByAltText('medication-add-icon');
    fireEvent.click(addIcon);

    expect(handleAddCondition).toBeCalledTimes(1);
  });

  test('Should render vertical line when medication has child with condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: 'Abstral 100 microgram sublingual tablets',
      child: [
        {
          id: 'b53a26c3',
          condition: 'dosage',
          operation: 'And',
          child: [],
          dosage: {
            level: 'Medium',
            dosage: '10',
            unit: 'drops',
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Medication caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const verticalLine = container.getElementsByClassName('vertical-line');
    expect(verticalLine[0]).toBeInTheDocument();
  });

  test('Should render vertical line when medication has child without condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'b53a26c3',
          condition: '',
          operation: 'And',
          child: [],
        },
      ],
    };
    const { container } = renderWithContext(
      <Medication caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const verticalLine = container.getElementsByClassName(
      'vertical-line-condition',
    );
    const addButton = screen.getByText('+ Add other condition details');
    expect(verticalLine[0]).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test('Should render dosage component when medication has dosage child component', () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'b53a26c3',
          condition: 'dosage',
          operation: 'And',
          child: [],
          dosage: {
            level: 'Medium',
            dosage: '10',
            unit: 'drops',
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Medication caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const dosageInputFields = container.querySelector('input[name="dosage"]');
    expect(dosageInputFields).toBeInTheDocument();
  });

  test('Should render started component when medication has started child component', () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'cc9e90ff',
          condition: 'started',
          operation: 'And',
          child: [],
          started: {
            value: '10',
            period: '',
          },
        },
      ],
    };
    renderWithContext(
      <Medication caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const inputFields = screen.getByRole('spinbutton');
    expect(inputFields).toBeInTheDocument();
  });

  test('Should render course of therphy component when medication has course of therphy child component', () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'cc9e90ff',
          condition: 'course of therapy',
          operation: 'And',
          child: [],
        },
      ],
    };
    renderWithContext(
      <Medication caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const courseOfTherapyText = screen.getByText('CourseOfTherapy');
    expect(courseOfTherapyText).toBeInTheDocument();
  });

  test('Should render vertical dashed line', () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'cc9e90ff',
          condition: '',
          operation: 'And',
          child: [],
        },
      ],
    };
    renderWithContext(<Medication caseDetails={caseDetailsWithCaseName} />);
    const verticalLine = screen.getByTestId('vertical-line');

    expect(verticalLine).toHaveAttribute(
      'style',
      'border-left: 2px dashed #D3D6D9; height: 32px;',
    );
  });

  test('Should render vertical solid line', () => {
    const caseDetailsWithCaseName = {
      name: 'Medication',
      case: 'Medication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'cc9e90ff',
          condition: 'course of therapy',
          operation: 'And',
          child: [],
        },
      ],
    };
    renderWithContext(<Medication caseDetails={caseDetailsWithCaseName} />);
    const verticalLine = screen.getByTestId('vertical-line');

    expect(verticalLine).toHaveAttribute(
      'style',
      'border-left: 2px solid #D3D6D9; height: 32px;',
    );
  });
});
