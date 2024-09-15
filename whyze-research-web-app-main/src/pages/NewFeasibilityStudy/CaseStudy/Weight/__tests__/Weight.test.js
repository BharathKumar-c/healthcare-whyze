import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';

import store from '../../../../../redux/store';
import Weight from '..';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

const caseDetails = {
  name: 'Weight',
  case: 'Weight',
  condition: 'Inclusion',
  caseName: '',
  child: [
    {
      id: '1892f325',
      condition: 'Weight range',
      field: 'weight',
      weightRange: {
        min: 10,
        max: 30,
        range: '',
      },
    },
  ],
};

describe('create testcases for Weight', () => {
  test('should create snapshots for weight', () => {
    const { container } = renderWithContext(
      <Weight caseDetails={caseDetails.child} />,
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
    const { container } = renderWithContext(
      <Weight caseDetails={caseDetails.child} />,
    );
    const dragIcon = container.getElementsByClassName(
      'weight_range-wrapper_drag-icon',
    );

    expect(dragIcon[0].textContent).toBe('Drag.svg');
  });

  test('Should render min input field correctly', async () => {
    const { container } = renderWithContext(
      <Weight caseDetails={caseDetails.child} parentIndex={2} />,
    );
    const minInputField = container.querySelector('input[name="min"');
    expect(minInputField).toBeInTheDocument();
    expect(minInputField.value).toBe('10');

    fireEvent.change(minInputField, { target: { value: 30 } });

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].weightRange
          .min,
      ).toEqual('30');
    });
  });

  test('Should render max input field correctly', async () => {
    const { container } = renderWithContext(
      <Weight caseDetails={caseDetails.child} parentIndex={2} />,
    );
    const maxInputField = container.querySelector('input[name="max"');
    expect(maxInputField).toBeInTheDocument();
    expect(maxInputField.value).toBe('30');

    fireEvent.change(maxInputField, { target: { value: 60 } });

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].weightRange
          .max,
      ).toEqual('60');
    });
  });

  test('Should render unit select field correctly', async () => {
    const { container } = renderWithContext(
      <Weight caseDetails={caseDetails.child} parentIndex={2} />,
    );
    const unitSelectField = screen.getByRole('combobox');
    expect(unitSelectField).toBeInTheDocument();
    expect(unitSelectField).toHaveAttribute('aria-label', 'weight-unit');
    const defaultValue = container.getElementsByClassName(
      'ant-select-selection-item',
    );
    expect(defaultValue[0].textContent).toBe('Kg');

    fireEvent.change(unitSelectField, { target: { value: 'lbs' } });
    const option = screen.getByTitle('Lbs');
    fireEvent.click(option);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.feasibilityStudy[2].child[0].weightRange
          .range,
      ).toEqual('lbs');
    });
  });
});
