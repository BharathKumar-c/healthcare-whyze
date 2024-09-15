import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import SiteAndCountryDetails from '..';
import React from 'react';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
describe('create tests for SelectedCountry', () => {
  test('create snapshots', () => {
    const { container } = renderWithContext(<SiteAndCountryDetails />);
    expect(container).toMatchSnapshot();
  });
});
