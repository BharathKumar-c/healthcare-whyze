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
import Severity from '..';
import userEvent from '@testing-library/user-event';
const caseDetailsWithCaseName = {
  id: '343fcad6',
  condition: 'severity',
  operation: 'And',
  child: [],
  severity: {
    stage: 'stage-1',
  },
};

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

describe('create test cases for Severity', () => {
  test('create snapshots for Severity', () => {
    const { container } = renderWithContext(<Severity />);
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
      <Severity
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
      <Severity
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
      <Severity
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
      <Severity
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
      <Severity
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
      <Severity
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

  test('Should render the severity level select field correctly', async () => {
    renderWithContext(
      <Severity caseDetails={caseDetailsWithCaseName} parentIndex={0} />,
    );

    const dosageLevelSelect = screen.getAllByRole('combobox');
    expect(dosageLevelSelect[0]).toBeInTheDocument();
    expect(dosageLevelSelect[0]).toHaveAttribute(
      'aria-label',
      'severity-level',
    );

    fireEvent.change(dosageLevelSelect[0], { target: { value: 'stage 2' } });
    const option = screen.getByTitle('Stage 2');

    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      expect(
        segments[activeSegment.index]?.feasibilityStudy[0].child[0].severity
          .stage,
      ).toBe('stage-2');
    });
  });

  test('Check onclick fucntion in Close icon', async () => {
    const { segments, activeSegment } = JSON.parse(
      JSON.stringify(store.getState().feasibilityStudyReducer),
    );
    renderWithContext(
      <Severity
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
