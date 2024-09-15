import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../../../redux/store';
import Nicotine from '..';
import userEvent from '@testing-library/user-event';
import { nicotineConstants } from '../../../../../constant/ConstantTexts';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
const caseDetails = {
  name: 'Nicotine',
  case: 'Nicotine',
  condition: 'Inclusion',
  caseName: '',
  child: [],
};

describe('Test cases for Nicotine', () => {
  test('Create the snapshots for Nicotine', () => {
    const { container } = renderWithContext(<Nicotine />);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy.push(caseDetails);
      store.dispatch(setSegments(segments));
    });

    expect(container).toMatchSnapshot();
  });

  test('Nicotine Condition input box', () => {
    renderWithContext(<Nicotine />);
    const inputBox = screen.getByRole('textbox');

    expect(inputBox).toBeInTheDocument();
    expect(inputBox.value).toMatch('');
    userEvent.type(inputBox, 'test12345');
    expect(inputBox.value).toBe('test12345');
  });

  test('Should render the Add icon correctly', () => {
    renderWithContext(<Nicotine />);

    const addIcon = screen.getByAltText('nicotine-add-icon');
    expect(addIcon).toBeInTheDocument();
  });

  test('Should render error text when click add icon without caseName correctly', () => {
    renderWithContext(<Nicotine caseDetails={caseDetails} />);

    const addIcon = screen.getByAltText('nicotine-add-icon');
    fireEvent.click(addIcon);

    const errorText = screen.getByText(
      nicotineConstants.nicotineConditionErrorMessage,
    );
    expect(errorText).toBeInTheDocument();
  });

  test('Should render error text when click add icon with empty caseName correctly', () => {
    const caseDetailsWithEmptyCaseName = {
      name: 'Nicotine',
      case: 'Nicotine',
      condition: 'Inclusion',
      caseName: '',
      child: [],
    };
    renderWithContext(<Nicotine caseDetails={caseDetailsWithEmptyCaseName} />);

    const addIcon = screen.getByAltText('nicotine-add-icon');
    fireEvent.click(addIcon);

    const errorText = screen.getByText(
      nicotineConstants.nicotineConditionErrorMessage,
    );
    expect(errorText).toBeInTheDocument();
  });

  test('Should render when click add icon with caseName correctly', async () => {
    const caseDetailsWithCaseName = {
      name: 'Nicotine',
      case: 'Nicotine',
      condition: 'Inclusion',
      caseName: 'Covid',
      child: [],
    };

    const handleAddCondition = jest.fn();
    renderWithContext(
      <Nicotine
        caseDetails={caseDetailsWithCaseName}
        parentIndex={2}
        handleAddCondition={handleAddCondition}
      />,
    );

    const addIcon = screen.getByAltText('nicotine-add-icon');
    fireEvent.click(addIcon);

    expect(handleAddCondition).toBeCalledTimes(1);
  });

  test('Should render vertical line when nicotine has child with condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Nicotine',
      case: 'Nicotine',
      condition: 'Inclusion',
      caseName: 'Covid',
      child: [
        {
          id: 'fd8ac8ff',
          condition: 'quit',
          operation: 'And',
          child: [
            {
              id: 'e7079155',
              condition: 'started',
              operation: 'And',
              child: [],
              started: {},
            },
          ],
          quit: {
            period: 'day',
            value: '22',
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Nicotine caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const verticalLine = container.getElementsByClassName('vertical-line');
    expect(verticalLine[0]).toBeInTheDocument();
  });

  test('Should render vertical line when nicotine has child without condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Nicotine',
      case: 'Nicotine',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'fd8ac8ff',
          condition: '',
          operation: 'And',
          child: [],
        },
      ],
    };
    const { container } = renderWithContext(
      <Nicotine caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const verticalLine = container.getElementsByClassName(
      'vertical-line-condition',
    );
    const addButton = screen.getByText('+ Add other condition details');
    expect(verticalLine[0]).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test('Should render vertical dashed line', () => {
    const caseDetailsWithCaseName = {
      name: 'Nicotine',
      case: 'Nicotine',
      condition: 'Inclusion',
      caseName: 'Covid',
      child: [
        {
          id: 'fd8ac8ff',
          condition: '',
          operation: 'And',
          child: [],
        },
      ],
    };
    renderWithContext(<Nicotine caseDetails={caseDetailsWithCaseName} />);
    const verticalLine = screen.getByTestId('vertical-line');

    expect(verticalLine).toHaveAttribute(
      'style',
      'border-left: 2px dashed #D3D6D9; height: 32px;',
    );
  });

  test('Should render vertical solid line', () => {
    const caseDetailsWithCaseName = {
      name: 'Nicotine',
      case: 'Nicotine',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: 'fd8ac8ff',
          condition: 'quit',
          operation: 'And',
          child: [],
        },
      ],
    };
    renderWithContext(<Nicotine caseDetails={caseDetailsWithCaseName} />);
    const verticalLine = screen.getByTestId('vertical-line');

    expect(verticalLine).toHaveAttribute(
      'style',
      'border-left: 2px solid #D3D6D9; height: 32px;',
    );
  });
});
