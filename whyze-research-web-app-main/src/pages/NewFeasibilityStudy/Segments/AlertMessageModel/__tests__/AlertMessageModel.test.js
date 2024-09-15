import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import AlertMessageModel from '..';
import React from 'react';
function renderWithContext(element) {
  const { container, getByRole, getAllByText, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByRole, getAllByText, getByText };
}
const activeSegment = {
  name: 'demoActiveSegment',
  index: 0,
};
const activeSegmenttwo = {
  name: 'demoActiveSegment',
  index: 1,
};

describe('write testcases for Alertmessagemodal', () => {
  test('create snapshots for segments', () => {
    const { container } = renderWithContext(
      <AlertMessageModel activeSegment={activeSegment} />,
    );
    expect(container).toMatchSnapshot();
  });
  test('should  Alert modal open ', () => {
    const { container } = renderWithContext(
      <AlertMessageModel activeSegment={activeSegmenttwo} isOpen={true} />,
    );
    expect(container).toBeInTheDocument();
  });
  test('should Alert modal render content  ', () => {
    const { getByText } = renderWithContext(
      <AlertMessageModel activeSegment={activeSegmenttwo} isOpen={true} />,
    );
    const messageinModal = getByText(/Do you Want to delete these Segment/i);
    expect(messageinModal).toBeInTheDocument();
  });
  test('should Alert modal save ', () => {
    const { container, getByRole } = renderWithContext(
      <AlertMessageModel activeSegment={activeSegmenttwo} isOpen={true} />,
    );
    const submitButton = getByRole('button', { name: 'Confirm' });
    fireEvent.click(submitButton);

    expect(container).toBeInTheDocument();
  });
  test('should Alert modal close ', () => {
    const { container, getByRole } = renderWithContext(
      <AlertMessageModel activeSegment={activeSegmenttwo} isOpen={true} />,
    );
    const submitButton = getByRole('button', { name: 'Cancel' });
    fireEvent.click(submitButton);

    expect(container).toBeInTheDocument();
  });
  test('should Alert modal save with 0th index itshows message  ', () => {
    const { getByRole, getByText } = renderWithContext(
      <AlertMessageModel activeSegment={activeSegment} isOpen={true} />,
    );
    const submitButton = getByRole('button', { name: 'Ok' });
    fireEvent.click(submitButton);
    const messageinModal = getByText(/You Cannot delete these Segment/i);
    expect(messageinModal.textContent).toBe(
      'You Cannot delete these Segment . need atleast one segment',
    );
  });
});
