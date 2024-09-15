import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../../../redux/store';
import Demographics from '..';
const mockedUsedNavigate = jest.fn();
import ApiUtil from '../../../../../utils/ApiUtils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('axios');
jest.mock('../../../../../utils/ApiUtils');

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
const caseDetails = [
  {
    id: '07b8d849',
    condition: 'Gender',
    field: 'gender',
    gender: '',
  },
  {
    id: '06b35f26',
    condition: 'Age range',
    field: 'age',
    ageRange: {
      min: 0,
      max: 0,
    },
  },
];

describe('Test cases for Demographics', () => {
  test('Create the snapshots for Demographics', () => {
    const { container } = renderWithContext(
      <Demographics caseDetails={caseDetails} />,
    );

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
    const { container } = renderWithContext(
      <Demographics caseDetails={caseDetails} />,
    );
    const minAgeRangeInputField = container.querySelector('input[name="min"]');
    expect(minAgeRangeInputField).toBeInTheDocument();
    const maxAgeRangeInputField = container.querySelector('input[name="max"]');
    expect(maxAgeRangeInputField).toBeInTheDocument();
    const maleInputField = container.querySelector('input[name="Male"]');
    expect(maleInputField).toBeInTheDocument();
    const femaleInputField = container.querySelector('input[name="Female"]');
    expect(femaleInputField).toBeInTheDocument();
  });

  test('Should render the No of patient tag correctly when sent the total patients count', () => {
    const { container } = renderWithContext(
      <Demographics caseDetails={caseDetails} totalpatient={10000} />,
    );
    const noOfPatinetsAgeRangeTag = container.getElementsByClassName(
      'demographics_agerange-wrapper_totalpatient-tag',
    );
    expect(noOfPatinetsAgeRangeTag[0]).toBeInTheDocument();
    const noOfPatinetsGenderTag = container.getElementsByClassName(
      'demographics_gender-wrapper_totalpatient-tag',
    );
    expect(noOfPatinetsGenderTag[0]).toBeInTheDocument();
  });

  test('Test on change event', async () => {
    const { container } = renderWithContext(
      <Demographics
        caseDetails={caseDetails}
        currentIndex={1}
        totalpatient={10000}
      />,
    );

    const minAgeRangeInputField = container.querySelector('input[name="min"]');
    expect(minAgeRangeInputField).toBeInTheDocument();
    const maxAgeRangeInputField = container.querySelector('input[name="max"]');
    expect(maxAgeRangeInputField).toBeInTheDocument();
    const maleInputField = container.querySelector('input[name="Male"]');
    expect(maleInputField).toBeInTheDocument();
    const femaleInputField = container.querySelector('input[name="Female"]');
    expect(femaleInputField).toBeInTheDocument();

    fireEvent.change(minAgeRangeInputField, {
      target: { value: '10' },
    });
    fireEvent.change(maxAgeRangeInputField, {
      target: { value: '50' },
    });
    fireEvent.click(maleInputField);
    fireEvent.click(femaleInputField);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[1].child[1].ageRange
          .min,
      ).toBe('10');
      expect(
        segments[activeSegment.index]?.feasibilityStudy[1].child[1].ageRange
          .max,
      ).toBe('50');
      expect(
        segments[activeSegment.index]?.feasibilityStudy[1].child[0].gender,
      ).toBe('Male,Female');
      expect(
        segments[activeSegment.index]?.feasibilityStudy[1].child[0].gender,
      ).toBe('Male,Female');
    });
  });

  test('API Get Count ', async () => {
    renderWithContext(
      <Demographics
        caseDetails={caseDetails}
        currentIndex={1}
        totalpatient={10000}
      />,
    );
    ApiUtil.postData.mockResolvedValue({
      data: {
        caseStudy: [
          {
            name: 'Indication',
            case: 'Indication',
            condition: 'Inclusion',
            caseName: 'Covid-19',
            child: [
              {
                id: 'e391a071',
                condition: 'diagnosed',
                operation: 'And',
                child: [],
                diagnosed: {
                  period: 'day',
                  value: '22',
                },
                count: 3984,
              },
            ],
          },
          {
            name: 'Demographics',
            case: 'Demographics',
            condition: 'Inclusion',
            caseName: '',
            child: [
              {
                id: '486ed60d',
                condition: 'Gender',
                field: 'gender',
                gender: 'Male',
                count: 3150,
              },
              {
                id: 'fbca0dfa',
                condition: 'Age range',
                field: 'age',
                ageRange: {
                  min: 0,
                  max: 0,
                },
              },
            ],
          },
        ],
        country: [
          {
            Country: 'United Kingdom',
            count: '1',
          },
          {
            Country: 'Albania',
            count: '1',
          },
          {
            Country: null,
            count: '3137',
          },
          {
            Country: 'Brazil',
            count: '4',
          },
          {
            Country: 'Ireland',
            count: '4',
          },
          {
            Country: 'Portugal',
            count: '3',
          },
        ],
      },
      status: 200,
      statusText: '',
      headers: {
        'content-length': '724',
        'content-type': 'application/json; charset=utf-8',
      },
      request: {},
    });
    await waitFor(() => {
      expect(ApiUtil.postData).toHaveBeenCalledTimes(1);
    });
  });
});
