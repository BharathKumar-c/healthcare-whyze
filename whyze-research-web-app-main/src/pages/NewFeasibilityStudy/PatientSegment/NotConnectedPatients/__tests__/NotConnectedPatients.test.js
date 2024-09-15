import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import React from 'react';
import { NotConnectedPatients } from '..';

function renderWithContext(element) {
  const { container, getByText, getByRole, getByLabelText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText, getByRole, getByLabelText };
}

describe('create tests for NotConnectedPatients', () => {
  test('should create snapshots', () => {
    const { container } = renderWithContext(<NotConnectedPatients />);
    expect(container).toMatchSnapshot();
  });
  test('should check title render correctly', () => {
    const { container } = renderWithContext(<NotConnectedPatients />);
    const siteStext = container.getElementsByClassName('sites-text');

    expect(siteStext[0].firstChild.textContent).toBe('Not connected to sites');
  });

  test('should check NotConnectedPatients render correctly', () => {
    const { container } = renderWithContext(
      <NotConnectedPatients noOfNotConncetedPatients={1000} />,
    );
    expect(
      container.getElementsByClassName('no-of-patients-text')[0].firstChild
        .textContent,
    ).toBe('1000');
  });
});
