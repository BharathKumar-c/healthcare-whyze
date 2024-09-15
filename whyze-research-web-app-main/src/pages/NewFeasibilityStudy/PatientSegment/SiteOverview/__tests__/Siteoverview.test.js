import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import React from 'react';
import SiteOverview from '..';

function renderWithContext(element) {
  const { container, getByText, getByRole, getByLabelText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText, getByRole, getByLabelText };
}
describe('create tests for SiteOverview', () => {
  test('create snapshot for SiteOverview', () => {
    const { container } = renderWithContext(<SiteOverview />);
    expect(container).toMatchSnapshot();
  });
});
