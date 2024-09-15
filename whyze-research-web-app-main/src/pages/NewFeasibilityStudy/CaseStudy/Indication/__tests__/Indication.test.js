import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import React from 'react';
import Indication from '..';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import { act } from 'react-dom/test-utils';
import ApiUtil from '../../../../../utils/ApiUtils';
import { medicationConstants } from '../../../../../constant/ConstantTexts';
function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
jest.mock('../../../../../utils/ApiUtils');
const feasibilityStudy = {
  name: 'Indication',
  case: 'Indication',
  condition: 'Inclusion',
  caseName: '',
  child: [],
};

describe('create test cases for Indication', () => {
  test('create snapshot for Indication', () => {
    const { container } = renderWithContext(<Indication />);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy.push(feasibilityStudy);
      store.dispatch(setSegments(segments));
    });
    expect(container).toMatchSnapshot();
  });
  test('Should render the input field correctly', async () => {
    renderWithContext(<Indication />);
    ApiUtil.getData.mockResolvedValue({
      data: {
        result: [
          [
            {
              Name: 'Covid-19',
            },
            {
              Name: 'Covid-19 with pneumonia, sars-cov-2 identified',
            },
          ],
        ],
      },
    });
    const inputField = screen.getByRole('combobox');

    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toMatch('');

    fireEvent.change(inputField, {
      target: { value: 'Covi' },
    });
    expect(inputField.value).toMatch('Covi');

    await waitFor(() => {
      expect(ApiUtil.getData).toHaveBeenCalledWith(
        'search/indication?value=Covi',
      );
    });
  });
  test('Should show the Enter 3 or more Characters text when casename has less than three letters', () => {
    renderWithContext(<Indication />);

    const inputField = screen.getByRole('combobox');

    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toMatch('');

    fireEvent.change(inputField, {
      target: { value: 'Co' },
    });

    const contentText = screen.getByText('Enter 3 or more Characters');
    expect(contentText).toBeInTheDocument();
  });
  test('Should render the Add icon correctly', () => {
    renderWithContext(<Indication />);

    const addIcon = screen.getByAltText('Indication-add-icon');
    expect(addIcon).toBeInTheDocument();
  });
  test('Should render error text when click add icon without caseName correctly', () => {
    renderWithContext(<Indication caseDetails={feasibilityStudy} />);

    const addIcon = screen.getByAltText('Indication-add-icon');
    fireEvent.click(addIcon);

    const errorText = screen.getByText(
      `${medicationConstants.medicationConditionErrorMessage}`,
    );
    expect(errorText).toBeInTheDocument();
  });
  test('Should render error text when click add icon with empty caseName correctly', () => {
    const caseDetailsWithEmptyCaseName = {
      name: 'Indication',
      case: 'Indication',
      condition: 'Inclusion',
      caseName: '',
      child: [],
    };
    renderWithContext(
      <Indication caseDetails={caseDetailsWithEmptyCaseName} />,
    );

    const addIcon = screen.getByAltText('Indication-add-icon');
    fireEvent.click(addIcon);

    const errorText = screen.getByText(
      medicationConstants.medicationConditionErrorMessage,
    );
    expect(errorText).toBeInTheDocument();
  });

  test('Should render when click add icon with caseName correctly', async () => {
    const caseDetailsWithCaseName = {
      name: 'Indication',
      case: 'Indication',
      condition: 'Inclusion',
      caseName: 'Covid-19',
      child: [],
    };

    const handleAddCondition = jest.fn();
    renderWithContext(
      <Indication
        caseDetails={caseDetailsWithCaseName}
        parentIndex={0}
        handleAddCondition={handleAddCondition}
      />,
    );

    const addIcon = screen.getByAltText('Indication-add-icon');
    fireEvent.click(addIcon);

    expect(handleAddCondition).toBeCalledTimes(1);
  });
  test('Should render vertical line when medication has child with condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Indication',
      case: 'Indication',
      condition: 'Inclusion',
      caseName: 'Covid-19',
      child: [
        {
          id: '343fcad6',
          condition: 'Recovered',
          operation: 'And',
          child: [],
          recovered: {
            period: 'day',
            value: 22,
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Indication caseDetails={caseDetailsWithCaseName} isChild />,
    );

    const verticalLine = container.getElementsByClassName('vertical-line');
    expect(verticalLine[0]).toBeInTheDocument();
  });

  test('Should render vertical line when medication has child without condition', () => {
    const caseDetailsWithCaseName = {
      name: 'Indication',
      case: 'Indication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: '343fcad6',
          condition: '',
          operation: 'And',
          child: [],
        },
      ],
    };
    const { container } = renderWithContext(
      <Indication caseDetails={caseDetailsWithCaseName} isChild />,
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
      name: 'Indication',
      case: 'Indication',
      condition: 'Inclusion',
      caseName: '',
      child: [
        {
          id: '343fcad6',
          condition: 'Recovered',
          operation: 'And',
          child: [],
          recovered: {
            period: 'day',
            value: 22,
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Indication caseDetails={caseDetailsWithCaseName} isChild />,
    );
    expect(container).toBeInTheDocument();
  });
});
