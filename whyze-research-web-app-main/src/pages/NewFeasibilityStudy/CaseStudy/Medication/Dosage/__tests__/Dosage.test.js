import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import Dosage from '..';
import store from '../../../../../../redux/store';
import { setSegments } from '../../../../../../redux/reducer/feasibilityStudyReducer';
import userEvent from '@testing-library/user-event';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

const caseDetails = {
  name: 'Medication',
  case: 'Medication',
  condition: 'Inclusion',
  caseName: 'Abstral 100 microgram sublingual tablets',
  child: [
    {
      id: '6739a4b5',
      condition: 'started',
      operation: 'And',
      child: [],
      started: {},
    },
    {
      id: '9c66c529',
      condition: 'dosage',
      operation: 'And',
      child: [],
      dosage: {},
    },
  ],
};

describe('Test Cases for dosage component', () => {
  test('Create the snapshots for dosage', () => {
    const { container } = renderWithContext(<Dosage />);

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
    renderWithContext(<Dosage caseDetails={caseDetails.child[1]} />);
    const images = screen.getAllByRole('img');
    const dragIcon = screen.getByAltText('drag-icon');
    expect(images.length).toBe(4);
    expect(dragIcon).toBeInTheDocument();
  });

  test('Should render the Add icon correctly', () => {
    renderWithContext(<Dosage caseDetails={caseDetails.child[1]} />);
    const addIcon = screen.getByAltText('add-icon');
    expect(addIcon).toBeInTheDocument();
  });

  test('Check onclick fucntion in Add icon', async () => {
    const { store } = renderWithContext(
      <Dosage caseDetails={caseDetails.child[1]} parentIndex={2} />,
    );

    const addIcon = screen.getByAltText('add-icon');
    userEvent.click(addIcon);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[1].child
          .length,
      ).toBe(1);
    });
  });

  test('Should render the close icon correctly', () => {
    renderWithContext(<Dosage caseDetails={caseDetails.child[1]} />);
    const closeIcon = screen.getByAltText('close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  test('Should render the No of patient tag correctly when sent the total patients count', () => {
    const { container } = renderWithContext(
      <Dosage caseDetails={caseDetails.child[1]} totalpatient={10000} />,
    );
    const noOfPatinetsTag = container.getElementsByClassName(
      'indication-no-patient-tag',
    );
    expect(noOfPatinetsTag[0]).toBeInTheDocument();
  });

  test('Should render the relation select correctly', async () => {
    const { container } = renderWithContext(
      <Dosage caseDetails={caseDetails.child[1]} parentIndex={2} />,
    );

    const customSelectBox = container.getElementsByClassName('custom-select');
    fireEvent.click(customSelectBox[0]);
    const option2 = screen.getByText(/But not/i);
    fireEvent.click(option2);
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[1].operation,
      ).toBe('But not');
    });
  });

  test('Should render the dosage field correctly', async () => {
    const { store, container } = renderWithContext(
      <Dosage caseDetails={caseDetails.child[1]} parentIndex={2} />,
    );

    const dosageInputFields = container.querySelector('input[name="dosage"]');

    expect(dosageInputFields).toBeInTheDocument();
    expect(dosageInputFields.value).toMatch('');

    fireEvent.change(dosageInputFields, { target: { value: '100' } });
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[1].dosage
          .dosage,
      ).toBe('100');
    });
  });

  test('Should render the dosage level select field correctly', async () => {
    const { store } = renderWithContext(
      <Dosage caseDetails={caseDetails.child[1]} parentIndex={2} />,
    );

    const dosageLevelSelect = screen.getAllByRole('combobox');
    expect(dosageLevelSelect[0]).toBeInTheDocument();
    expect(dosageLevelSelect[0]).toHaveAttribute('aria-label', 'dosage-level');
    fireEvent.change(dosageLevelSelect[0], { target: { value: 'Low' } });
    const option = screen.getByTitle('Low');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[1].dosage
          .level,
      ).toBe('Low');
    });
  });

  test('Should render the dosage unit select field correctly', async () => {
    const { store } = renderWithContext(
      <Dosage caseDetails={caseDetails.child[1]} parentIndex={2} />,
    );

    const dosageUnitSelect = screen.getAllByRole('combobox');
    expect(dosageUnitSelect[1]).toBeInTheDocument();
    expect(dosageUnitSelect[1]).toHaveAttribute('aria-label', 'dosage-unit');

    fireEvent.change(dosageUnitSelect[1], { target: { value: 'capsule' } });
    const option = screen.getByTitle('capsule');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[1].dosage.unit,
      ).toBe('capsule');
    });
  });

  test('Should render medication when  dosage has child correctly', () => {
    const caseDetailsWithchild = {
      id: '9c66c529',
      condition: 'dosage',
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
      dosage: {},
    };
    renderWithContext(
      <Dosage caseDetails={caseDetailsWithchild} parentIndex={2} />,
    );
    const inputFields = screen.getAllByRole('spinbutton');
    expect(inputFields[1].value).toBe('10');
  });

  test('Check onclick fucntion in Close icon', async () => {
    const { store } = renderWithContext(
      <Dosage caseDetails={caseDetails.child[1]} parentIndex={2} />,
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
