import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../../../redux/store';
import Bmi from '../index';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
const caseDetails = {
  name: 'Bmi',
  case: 'Bmi',
  condition: 'Inclusion',
  caseName: '',
  child: [],
};

describe('Test cases for BMI', () => {
  test('Create the snapshots for BMI', () => {
    const { container } = renderWithContext(<Bmi />);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy.push(caseDetails);
      store.dispatch(setSegments(segments));
    });

    expect(container).toMatchSnapshot();
  });

  test('Render Components in BMI', () => {
    renderWithContext(<Bmi />);
    const selectBox = screen.getByRole('combobox');
    expect(selectBox).toBeInTheDocument();
    fireEvent.change(selectBox, {
      target: { value: 'obesity' },
    });
    const contentText = screen.getByText('Obesity (>=30)');
    expect(contentText).toBeInTheDocument();
  });
});
