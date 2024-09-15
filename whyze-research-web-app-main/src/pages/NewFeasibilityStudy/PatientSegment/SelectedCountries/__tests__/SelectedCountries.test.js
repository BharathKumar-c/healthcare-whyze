import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import SelectedCountries from '..';
import React from 'react';

const democountryList = [
  { Country: 'United Kingdom' },
  { Country: 'Albania', count: '1' },
  { Country: 'Brazil', count: '4' },
  { Country: 'Ireland', count: '4' },
];
function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
describe('create tests for SelectedCountry', () => {
  test('create snapshots', () => {
    const { container } = renderWithContext(<SelectedCountries />);
    expect(container).toMatchSnapshot();
  });
  test('All country render corrctly', () => {
    const { container } = renderWithContext(
      <SelectedCountries countriesList={democountryList} isShowSwitch />,
    );
    expect(container).toBeInTheDocument();
  });
});
