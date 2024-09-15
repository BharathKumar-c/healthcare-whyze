import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import Quit from '..';
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
  name: 'Nicotine',
  case: 'Nicotine',
  condition: 'Inclusion',
  caseName: 'Covid',
  child: [
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
    {
      id: 'e5a13564',
      condition: 'started',
      operation: 'And',
      child: [],
      started: {
        period: 'day',
        value: '22',
      },
    },
  ],
};

describe('Test Cases for quit component', () => {
  test('Create the snapshots for Quit', () => {
    const { container } = renderWithContext(<Quit />);

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
    renderWithContext(<Quit caseDetails={caseDetails.child[1]} />);
    const images = screen.getAllByRole('img');
    const dragIcon = screen.getByAltText('drag-icon');
    expect(images.length).toBe(4);
    expect(dragIcon).toBeInTheDocument();
  });

  test('Should render the Add icon correctly', () => {
    renderWithContext(<Quit caseDetails={caseDetails.child[1]} />);
    const addIcon = screen.getByAltText('add-icon');
    expect(addIcon).toBeInTheDocument();
  });

  test('Check onclick fucntion in Add icon', async () => {
    const { store } = renderWithContext(
      <Quit caseDetails={caseDetails.child[1]} parentIndex={2} />,
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
    renderWithContext(<Quit caseDetails={caseDetails.child[1]} />);
    const closeIcon = screen.getByAltText('close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  test('Should render the No of patient tag correctly when sent the total patients count', () => {
    const { container } = renderWithContext(
      <Quit caseDetails={caseDetails.child[1]} totalpatient={10000} />,
    );
    const noOfPatinetsTag = container.getElementsByClassName(
      'indication-no-patient-tag',
    );
    expect(noOfPatinetsTag[0]).toBeInTheDocument();
  });

  test('Should render the relation select correctly', async () => {
    const { container } = renderWithContext(
      <Quit caseDetails={caseDetails.child[1]} parentIndex={2} />,
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

  test('Should render the Quit field correctly', async () => {
    const { store, container } = renderWithContext(
      <Quit caseDetails={caseDetails.child[1]} parentIndex={2} />,
    );

    const quitInputFields = container.querySelector('input[name="value"]');

    expect(quitInputFields).toBeInTheDocument();
    expect(quitInputFields.value).toMatch('');

    fireEvent.change(quitInputFields, { target: { value: '100' } });
    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[1].quit.value,
      ).toBe('100');
    });
  });

  test('Should render the quit unit select field correctly', async () => {
    const { store } = renderWithContext(
      <Quit caseDetails={caseDetails.child[1]} parentIndex={2} />,
    );

    const selectType = screen.getAllByRole('combobox', {
      name: 'quit-unit',
    });
    screen.debug();
    expect(selectType[0]).toBeInTheDocument();
    expect(selectType[0]).toHaveAttribute('aria-label', 'quit-unit');

    fireEvent.change(selectType[0], { target: { value: 'year' } });
    const option = screen.getByTitle('Year');
    userEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;
      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[1].quit.period,
      ).toBe('year');
    });
  });

  test('Should render nicotine when quit has child correctly', () => {
    const caseDetailsWithchild = {
      id: '9c66c529',
      condition: 'quit',
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
      started: {},
    };
    renderWithContext(
      <Quit caseDetails={caseDetailsWithchild} parentIndex={2} />,
    );
    const inputFields = screen.getAllByRole('spinbutton');
    expect(inputFields[1].value).toBe('10');
  });

  test('Check onclick fucntion in Close icon', async () => {
    const { store } = renderWithContext(
      <Quit caseDetails={caseDetails.child[1]} parentIndex={2} />,
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
