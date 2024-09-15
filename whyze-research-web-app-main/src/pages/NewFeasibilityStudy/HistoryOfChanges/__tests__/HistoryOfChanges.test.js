import React from 'react';
import { act, render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../../redux/store';
import HistoryOfChanges from '..';
const mockedUsedNavigate = jest.fn();
import ApiUtil from '../../../../utils/ApiUtils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('axios');
jest.mock('../../../../utils/ApiUtils');

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

afterEach(() => {
  jest.clearAllMocks();
});

const caseStudy = [
  {
    name: 'Indication',
    case: 'Indication',
    condition: 'Inclusion',
    caseName: 'T',
    child: [
      {
        id: '9c663fb3',
        condition: 'diagnosed',
        operation: 'And',
        child: [],
        diagnosed: {
          period: 'day',
          value: '22',
        },
        count: 3981,
      },
    ],
  },
  {
    name: 'Demographics',
    case: 'Demographics',
    condition: 'Inclusion',
    caseName: 'T',
    child: [
      {
        id: '28133c7b',
        condition: 'Gender',
        field: 'gender',
        gender: 'Male',
        count: 3147,
      },
      {
        id: '7f565179',
        condition: 'Age range',
        field: 'age',
        ageRange: {
          min: '1',
          max: '10',
        },
        count: 0,
      },
    ],
  },
];

describe('Test cases for History Of Changes', () => {
  test('Create the snapshots for History Of Changes', () => {
    const { container } = renderWithContext(<HistoryOfChanges />);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy = caseStudy;
      store.dispatch(setSegments(segments));
    });

    expect(container).toMatchSnapshot();
  });
  test('Render check', () => {
    const { container } = renderWithContext(<HistoryOfChanges />);

    const historyText = screen.getByText('History Of Changes');
    expect(historyText).toBeInTheDocument();
    const totalpopulation = container.getElementsByClassName(
      'HistoryOfChanges-wrapper_Total-population',
    );
    expect(totalpopulation[0]).toBeInTheDocument();
    const initialPopulation = container.getElementsByClassName(
      'HistoryOfChanges-wrapper_Initial-population',
    );
    expect(initialPopulation[0]).toBeInTheDocument();
  });

  test('get count api', async () => {
    renderWithContext(<HistoryOfChanges />);
    ApiUtil.getData.mockResolvedValue({
      data: {
        count: 3970,
      },
    });

    await waitFor(() => {
      expect(ApiUtil.getData).toHaveBeenCalledTimes(1);
    });
  });
});
