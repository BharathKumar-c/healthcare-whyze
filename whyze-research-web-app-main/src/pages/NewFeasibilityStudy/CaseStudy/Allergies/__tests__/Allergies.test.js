import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import React from 'react';
import Allergies from '..';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
const caseDetails = {
  name: 'Allergies',
  case: 'Allergies',
  condition: 'Inclusion',
  caseName: '',
  child: [],
};
describe('create tests for alleriges', () => {
  test('create snapshots for allergies', () => {
    const { container } = renderWithContext(<Allergies />);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy.push(caseDetails);
      store.dispatch(setSegments(segments));
    });
    expect(container).toMatchSnapshot();
  });
  test('Should render the input field correctly', () => {
    renderWithContext(<Allergies />);
    const inputField = screen.getByRole('combobox');

    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toMatch('');

    fireEvent.change(inputField, {
      target: { value: 'Sasm' },
    });
    expect(inputField.value).toMatch('Sasm');
  });
  test('Should render the Add icon correctly', () => {
    renderWithContext(<Allergies />);

    const addIcon = screen.getByAltText('allergies-add-icon');
    expect(addIcon).toBeInTheDocument();
  });
  test('Should render when click add icon with caseName correctly', async () => {
    const caseDetailsWithCaseName = {
      name: 'Allergies',
      case: 'Allergies',
      condition: 'Inclusion',
      caseName: 'Sesame Seeds',
      child: [],
    };

    const handleAddCondition = jest.fn();
    renderWithContext(
      <Allergies
        caseDetails={caseDetailsWithCaseName}
        parentIndex={1}
        handleAddCondition={handleAddCondition}
      />,
    );

    const addIcon = screen.getByAltText('allergies-add-icon');
    fireEvent.click(addIcon);

    expect(handleAddCondition).toBeCalledTimes(1);
  });
  test('Should render  component when allergies has reactions child component', () => {
    const caseDetailsWithCaseName = {
      name: 'Allergies',
      case: 'Allergies',
      condition: 'Inclusion',
      caseName: 'Sesame Seeds',
      child: [
        {
          id: 'b53a26c3',
          condition: 'reactions',
          operation: 'And',
          reactions: {
            symptom: 'Sneezing',
          },
        },
      ],
    };
    const { container } = renderWithContext(
      <Allergies caseDetails={caseDetailsWithCaseName} isChild />,
    );
    expect(container).toBeInTheDocument();
  });
  test('Should render reaction component when allergies has empty child component', () => {
    const caseDetailsWithCaseName = {
      name: 'Allergies',
      case: 'Allergies',
      condition: 'Inclusion',
      caseName: 'Sesame Seeds',
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
      <Allergies caseDetails={caseDetailsWithCaseName} isChild />,
    );
    expect(container).toBeInTheDocument();
  });
});
