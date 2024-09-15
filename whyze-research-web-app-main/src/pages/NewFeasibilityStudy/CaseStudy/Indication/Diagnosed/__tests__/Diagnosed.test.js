import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../../redux/store';
import React from 'react';
import { setSegments } from '../../../../../../redux/reducer/feasibilityStudyReducer';
import Diagnosed from '..';
import userEvent from '@testing-library/user-event';
const caseDetailsWithCaseName = {
  id: '6d7c2c51',
  condition: 'diagnosed',
  operation: 'And',
  child: [],
  diagnosed: {
    period: 'day',
    value: 22,
  },
};

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

describe('create test cases for Diagnosed', () => {
  test('create snapshots for Diagnosed', () => {
    const { container } = renderWithContext(<Diagnosed />);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy[0].child.push(
        caseDetailsWithCaseName,
      );
      store.dispatch(setSegments(segments));
    });
    expect(container).toMatchSnapshot();
  });
  test('Should render the drag icon correctly', () => {
    const { segments, activeSegment } =
      store.getState().feasibilityStudyReducer;
    renderWithContext(
      <Diagnosed
        caseDetails={
          segments[activeSegment.index]?.feasibilityStudy[0].child[0]
        }
      />,
    );
    const images = screen.getAllByRole('img');
    const dragIcon = screen.getByAltText('drag-icon');
    expect(images.length).toBe(4);
    expect(dragIcon).toBeInTheDocument();
  });
  test('Should render the Add icon correctly', () => {
    const { segments, activeSegment } =
      store.getState().feasibilityStudyReducer;

    renderWithContext(
      <Diagnosed
        caseDetails={
          segments[activeSegment.index]?.feasibilityStudy[0].child[0]
        }
      />,
    );
    const addIcon = screen.getByAltText('add-icon');
    expect(addIcon).toBeInTheDocument();
  });
  test('Check onclick fucntion in Add icon', async () => {
    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );
    renderWithContext(
      <Diagnosed
        caseDetails={
          segments[activeSegment.index]?.feasibilityStudy[0].child[0]
        }
        parentIndex={0}
      />,
    );

    const addIcon = screen.getByAltText('add-icon');
    userEvent.click(addIcon);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[0].child.length,
      ).toBe(1);
    });
  });
  test('Should render the close icon correctly', () => {
    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );
    renderWithContext(
      <Diagnosed
        caseDetails={
          segments[activeSegment.index]?.feasibilityStudy[0].child[0]
        }
      />,
    );
    const closeIcon = screen.getByAltText('close-icon');

    expect(closeIcon).toBeInTheDocument();
  });
  test('Should render the No of patient tag correctly when sent the total patients count', () => {
    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );
    const { container } = renderWithContext(
      <Diagnosed
        caseDetails={
          segments[activeSegment.index]?.feasibilityStudy[0].child[0]
        }
        totalpatient={'10000'}
      />,
    );
    const noOfPatinetsTag = container.getElementsByClassName(
      'indication-no-patient-tag',
    );
    expect(noOfPatinetsTag[0]).toBeInTheDocument();
  });
  test('Should render the relation select correctly', async () => {
    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );
    const { container } = renderWithContext(
      <Diagnosed
        caseDetails={
          segments[activeSegment.index]?.feasibilityStudy[0].child[0]
        }
        parentIndex={0}
      />,
    );

    const customSelectBox = container.getElementsByClassName('custom-select');
    fireEvent.click(customSelectBox[0]);
    const option2 = screen.getByText(/But not/i);
    fireEvent.click(option2);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[0].child[0].operation,
      ).toBe('But not');
    });
  });
  test('Should render the recovered field correctly', async () => {
    const { container } = renderWithContext(
      <Diagnosed caseDetails={caseDetailsWithCaseName} parentIndex={0} />,
    );

    const dosageInputFields = container.querySelector(
      'input[name="diagnosed"]',
    );

    expect(dosageInputFields).toBeInTheDocument();
    expect(dosageInputFields.value).toMatch('');

    fireEvent.change(dosageInputFields, { target: { value: '10' } });
    await waitFor(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );

      expect(
        segments[activeSegment.index]?.feasibilityStudy[0].child[0].diagnosed
          .value,
      ).toBe('10');
    });
  });
  test('Should render the diagnosed level select field correctly', async () => {
    renderWithContext(
      <Diagnosed caseDetails={caseDetailsWithCaseName} parentIndex={0} />,
    );

    const dosageLevelSelect = screen.getByRole('combobox');
    expect(dosageLevelSelect).toBeInTheDocument();
    expect(dosageLevelSelect).toHaveAttribute('aria-label', 'diagnosed-level');
    fireEvent.change(dosageLevelSelect, { target: { value: 'month' } });
    const option = screen.getByTitle('Month');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      expect(
        segments[activeSegment.index]?.feasibilityStudy[0].child[0].diagnosed
          .period,
      ).toBe('month');
    });
  });

  test('Check onclick fucntion in Close icon', async () => {
    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );
    renderWithContext(
      <Diagnosed
        caseDetails={
          segments[activeSegment.index]?.feasibilityStudy[0].child[0]
        }
        parentIndex={0}
      />,
    );

    const closeIcon = screen.getByAltText('close-icon');
    userEvent.click(closeIcon);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[0].child.length,
      ).toBe(0);
    });
  });
});
