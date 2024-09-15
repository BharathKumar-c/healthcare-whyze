import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { setSegments } from '../../../../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../../../../redux/store';
import From from '../';
import userEvent from '@testing-library/user-event';

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
  caseName: 'Surgery',
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

describe('Test cases for medication', () => {
  test('Create the snapshots for Medication', () => {
    const { container, store } = renderWithContext(
      <From caseDetails={caseDetails.child[0]} />,
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

  test('Should render the drag icon correctly', () => {
    renderWithContext(<From caseDetails={caseDetails.child[0]} />);
    const images = screen.getAllByRole('img');
    const dragIcon = screen.getByAltText('drag-icon');
    expect(images.length).toBe(4);
    expect(dragIcon).toBeInTheDocument();
  });

  test('Should render the Add icon correctly', () => {
    renderWithContext(<From caseDetails={caseDetails.child[0]} />);
    const addIcon = screen.getByAltText('add-icon');
    expect(addIcon).toBeInTheDocument();
  });

  test('Check onclick function when click Add icon', async () => {
    const { store } = renderWithContext(
      <From caseDetails={caseDetails.child[0]} parentIndex={2} />,
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
    renderWithContext(<From caseDetails={caseDetails.child[0]} />);
    const closeIcon = screen.getByAltText('close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  test('Should render the No of patient tag correctly when sent the total patients count', () => {
    const { container } = renderWithContext(
      <From caseDetails={caseDetails.child[0]} totalpatient={10000} />,
    );
    const noOfPatinetsTag = container.getElementsByClassName(
      'indication-no-patient-tag',
    );
    expect(noOfPatinetsTag[0]).toBeInTheDocument();
  });

  test('Should render the relation select correctly', async () => {
    const { container } = renderWithContext(
      <From caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const customSelectBox = container.getElementsByClassName('custom-select');
    fireEvent.click(customSelectBox[0]);
    const option2 = screen.getByText(/But not/i);
    fireEvent.click(option2);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].operation,
      ).toBe('But not');
    });
  });

  test('Should render the from input field correctly', async () => {
    const { store, container } = renderWithContext(
      <From caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const fromInputFields = container.querySelector('input[name="value"]');

    expect(fromInputFields).toBeInTheDocument();
    expect(fromInputFields.value).toMatch('');

    fireEvent.change(fromInputFields, { target: { value: '100' } });
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].from.value,
      ).toBe('100');
    });
  });

  test('Change from input field without period', async () => {
    const caseDetailsWithoutPeriod = {
      id: '348f4dbe',
      condition: 'from',
      operation: 'And',
      child: [],
      from: {
        value: '10',
        period: '',
      },
    };
    const { store, container } = renderWithContext(
      <From caseDetails={caseDetailsWithoutPeriod} parentIndex={2} />,
    );

    const fromInputFields = container.querySelector('input[name="value"]');

    expect(fromInputFields).toBeInTheDocument();
    expect(fromInputFields.value).toMatch('');

    fireEvent.change(fromInputFields, { target: { value: '100' } });
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].from.value,
      ).toBe('100');
    });
  });

  test('Should render the period select field correctly', async () => {
    renderWithContext(
      <From caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const startedPeriodSelect = screen.getByRole('combobox');
    expect(startedPeriodSelect).toBeInTheDocument();
    expect(startedPeriodSelect).toHaveAttribute('aria-label', 'from-period');

    fireEvent.change(startedPeriodSelect, { target: { value: 'month' } });
    const option = screen.getByTitle('Month');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].from.period,
      ).toBe('month');
    });
  });

  test('Select period without value in from', async () => {
    const caseDetailsWithoutValue = {
      id: '348f4dbe',
      condition: 'from',
      operation: 'And',
      child: [],
      from: {
        value: '',
        period: 'day',
      },
    };
    renderWithContext(
      <From caseDetails={caseDetailsWithoutValue} parentIndex={2} />,
    );

    const startedPeriodSelect = screen.getByRole('combobox');
    expect(startedPeriodSelect).toBeInTheDocument();
    expect(startedPeriodSelect).toHaveAttribute('aria-label', 'from-period');

    fireEvent.change(startedPeriodSelect, { target: { value: 'month' } });
    const option = screen.getByTitle('Month');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].from.period,
      ).toBe('month');
    });
  });

  test('Should render surgery when from has child correctly', () => {
    const caseDetailsWithchild = {
      id: '348f4dbe',
      condition: 'from',
      operation: 'And',
      child: [
        {
          id: '318a850a',
          condition: 'from',
          operation: 'And',
          child: [],
          from: {
            value: '2',
            period: 'month',
          },
        },
      ],
      from: {
        value: '10',
        period: 'month',
      },
    };
    renderWithContext(
      <From caseDetails={caseDetailsWithchild} parentIndex={2} />,
    );
    const inputFields = screen.getAllByRole('spinbutton');
    expect(inputFields[1].value).toBe('2');
  });

  test('Check onclick function in Close icon', async () => {
    const { store } = renderWithContext(
      <From caseDetails={caseDetails.child[0]} parentIndex={2} />,
    );

    const closeIcon = screen.getByAltText('close-icon');
    userEvent.click(closeIcon);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child.length,
      ).toBe(0);
    });
  });
});
