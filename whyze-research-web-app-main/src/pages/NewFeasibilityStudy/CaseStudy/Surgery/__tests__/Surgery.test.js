import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import Surgery from '..';
import { surgeryConstants } from '../../../../../constant/ConstantTexts';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../../../redux/store';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

const caseDetails = {
  name: 'Surgery',
  case: 'Surgery',
  condition: 'Inclusion',
  caseName: '',
  child: [],
};

describe('Test cases for medication', () => {
  test('Create the snapshots for Medication', () => {
    const { container, store } = renderWithContext(<Surgery />);

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
    renderWithContext(<Surgery />);
    const inputField = screen.getByRole('textbox');

    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toMatch('');

    fireEvent.change(inputField, {
      target: { value: 'Surgery' },
    });
    expect(inputField.value).toMatch('Surgery');
  });

  test('Should render the Add icon correctly', () => {
    renderWithContext(<Surgery />);

    const addIcon = screen.getByAltText('surgery-add-icon');
    expect(addIcon).toBeInTheDocument();
  });

  test('Should render error text when click add icon without caseName correctly', () => {
    renderWithContext(<Surgery caseDetails={caseDetails} />);

    const addIcon = screen.getByAltText('surgery-add-icon');
    fireEvent.click(addIcon);

    const errorText = screen.getByText(
      surgeryConstants.surgeryInputErrorMessage,
    );
    expect(errorText).toBeInTheDocument();
  });

  test('Should render when click add icon with caseName correctly', async () => {
    const caseDetailsWithCaseName = {
      name: 'Surgery',
      case: 'Surgery',
      condition: 'Inclusion',
      caseName: 'Surgery',
      child: [],
    };

    const handleAddCondition = jest.fn();
    renderWithContext(
      <Surgery
        caseDetails={caseDetailsWithCaseName}
        parentIndex={2}
        handleAddCondition={handleAddCondition}
      />,
    );

    const addIcon = screen.getByAltText('surgery-add-icon');
    fireEvent.click(addIcon);

    expect(handleAddCondition).toBeCalledTimes(1);
  });

  test('Should render vertical line when surgery has child with condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Surgery',
      case: 'Surgery',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: '348f4dbe',
          condition: 'from',
          operation: 'And',
          child: [],
          from: {
            period: 'day',
            value: '10',
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Surgery caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const verticalLine = container.getElementsByClassName('vertical-line');
    expect(verticalLine[0]).toBeInTheDocument();
  });

  test('Should render vertical line when surgery has child without condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Surgery',
      case: 'Surgery',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: '348f4dbe',
          condition: '',
          operation: 'And',
          child: [],
        },
      ],
    };
    const { container } = renderWithContext(
      <Surgery caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const verticalLine = container.getElementsByClassName(
      'vertical-line-condition',
    );
    const addButton = screen.getByText('+ Add other condition details');
    expect(verticalLine[0]).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test('Should render From component when surgery has from child component', () => {
    const caseDetailsWithCaseName = {
      name: 'Surgery',
      case: 'Surgery',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: '348f4dbe',
          condition: 'from',
          operation: 'And',
          child: [],
          from: {
            period: 'day',
            value: '10',
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Surgery caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const fromInputFields = container.querySelector('input[name="value"]');
    expect(fromInputFields).toBeInTheDocument();
  });

  test('Should render vertical dashed line', () => {
    const caseDetailsWithoutCaseName = {
      name: 'Surgery',
      case: 'Surgery',
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
    renderWithContext(<Surgery caseDetails={caseDetailsWithoutCaseName} />);
    const verticalLine = screen.getByTestId('vertical-line');

    expect(verticalLine).toHaveAttribute(
      'style',
      'border-left: 2px dashed #D3D6D9; height: 32px;',
    );
  });

  test('Should render vertical solid line', () => {
    const caseDetailsWithCaseName = {
      name: 'Surgery',
      case: 'Surgery',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: '348f4dbe',
          condition: 'from',
          operation: 'And',
          child: [],
          from: {
            period: 'day',
            value: '10',
          },
        },
      ],
    };
    renderWithContext(<Surgery caseDetails={caseDetailsWithCaseName} />);
    const verticalLine = screen.getByTestId('vertical-line');

    expect(verticalLine).toHaveAttribute(
      'style',
      'border-left: 2px solid #D3D6D9; height: 32px;',
    );
  });
});
