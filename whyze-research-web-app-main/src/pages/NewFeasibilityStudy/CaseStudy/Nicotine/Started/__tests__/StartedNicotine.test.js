import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import Started from '..';
import store from '../../../../../../redux/store';
import userEvent from '@testing-library/user-event';
import { setSegments } from '../../../../../../redux/reducer/feasibilityStudyReducer';

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
  child: [
    {
      id: 'cc9e90ff',
      condition: 'started',
      operation: 'And',
      child: [],
      started: {
        value: '10',
        period: 'day',
      },
    },
    {
      id: 'f45750a3',
      condition: 'quit',
      operation: 'And',
      child: [],
      quit: {
        period: 'day',
        value: '22',
      },
    },
  ],
};

describe('Test Cases for started component', () => {
  test('Create the snapshots for started', () => {
    const { container } = renderWithContext(<Started />);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy.push(caseDetails);
      store.dispatch(setSegments(segments));
    });

    expect(container).toMatchSnapshot();
  });

  test('Should render the drag icon correctly', () => {
    renderWithContext(<Started caseDetails={caseDetails.child[0]} />);
    const images = screen.getAllByRole('img');
    const dragIcon = screen.getByAltText('drag-icon');
    expect(images.length).toBe(4);
    expect(dragIcon).toBeInTheDocument();
  });

  test('Should render the Add icon correctly', async () => {
    renderWithContext(<Started caseDetails={caseDetails.child[0]} />);
    const addIcon = screen.getByAltText('add-icon');
    expect(addIcon).toBeInTheDocument();
  });

  test('Check onclick function in Add icon', async () => {
    const { store } = renderWithContext(
      <Started caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const addIcon = screen.getByAltText('add-icon');
    userEvent.click(addIcon);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].child
          .length,
      ).toBe(1);
    });
  });

  test('Should render the close icon correctly', () => {
    renderWithContext(<Started caseDetails={caseDetails.child[0]} />);
    const closeIcon = screen.getByAltText('close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  test('Should render the No of patient tag correctly when sent the total patients count', () => {
    const { container } = renderWithContext(
      <Started caseDetails={caseDetails.child[0]} totalpatient={10000} />,
    );
    const noOfPatinetsTag = container.getElementsByClassName(
      'indication-no-patient-tag',
    );
    expect(noOfPatinetsTag[0]).toBeInTheDocument();
  });

  test('Should render the relation select correctly', async () => {
    const { container } = renderWithContext(
      <Started caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const customSelectBox = container.getElementsByClassName('custom-select');
    fireEvent.click(customSelectBox[0]);
    const option2 = screen.getByText(/Or/i);
    fireEvent.click(option2);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].operation,
      ).toBe('Or');
    });
  });

  test('Should render the input field correctly', async () => {
    renderWithContext(
      <Started caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const inputFields = screen.getByRole('spinbutton');

    expect(inputFields).toBeInTheDocument();
    expect(inputFields.value).toMatch('');

    fireEvent.change(inputFields, { target: { value: '1' } });
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].started
          .value,
      ).toBe('1');
    });
  });

  test('Should assign the default value for period correctly', async () => {
    renderWithContext(
      <Started caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const inputFields = screen.getByRole('spinbutton');

    expect(inputFields).toBeInTheDocument();
    expect(inputFields.value).toMatch('');

    fireEvent.change(inputFields, { target: { value: '1' } });
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].started
          .period,
      ).toBe('day');
    });
  });

  test('Should render the period select field correctly', async () => {
    renderWithContext(
      <Started caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const startedPeriodSelect = screen.getByRole('combobox');
    expect(startedPeriodSelect).toBeInTheDocument();
    expect(startedPeriodSelect).toHaveAttribute('aria-label', 'started-period');

    fireEvent.change(startedPeriodSelect, { target: { value: 'month' } });
    const option = screen.getByTitle('Month');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].started
          .period,
      ).toBe('month');
    });
  });

  test('Should render the period select field without started value correctly', async () => {
    const caseDetailsWithOutValue = {
      id: '6739a4b5',
      condition: 'started',
      operation: 'And',
      child: [],
      started: {
        value: '',
        period: 'day',
      },
    };
    renderWithContext(
      <Started caseDetails={caseDetailsWithOutValue} parentIndex={2} />,
    );

    const startedPeriodSelect = screen.getByRole('combobox');
    expect(startedPeriodSelect).toBeInTheDocument();
    expect(startedPeriodSelect).toHaveAttribute('aria-label', 'started-period');

    fireEvent.change(startedPeriodSelect, { target: { value: 'month' } });
    const option = screen.getByTitle('Month');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].started
          .period,
      ).toBe('month');
    });
  });

  test('Should render nicotine when started has child', () => {
    const caseDetailsWithchild = {
      id: '9c66c529',
      condition: 'started',
      operation: 'And',
      child: [
        {
          id: '6739a4b5',
          condition: 'started',
          operation: 'And',
          child: [],
          started: {
            value: '10',
            period: 'day',
          },
        },
      ],
      quit: {},
    };
    renderWithContext(
      <Started caseDetails={caseDetailsWithchild} parentIndex={2} />,
    );
    const inputFields = screen.getAllByRole('spinbutton');
    expect(inputFields[1].value).toBe('10');
  });

  test('Check onclick fucntion in Close icon', async () => {
    const { store } = renderWithContext(
      <Started caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const closeIcon = screen.getByAltText('close-icon');

    userEvent.click(closeIcon);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child.length,
      ).toBe(1);
    });
  });
});
