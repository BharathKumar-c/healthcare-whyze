import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import CountryContainer from '..';
import React from 'react';

const democountryList = { Country: 'United Kingdom', count: 1 };

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
describe('test cases for CountryContainer', () => {
  test('create snapshots', () => {
    const { container } = renderWithContext(<CountryContainer />);
    expect(container).toMatchSnapshot();
  });
  test('should test unPinned country ', () => {
    const { container } = renderWithContext(
      <CountryContainer isPinned={false} country={democountryList} />,
    );
    const favoriteFilled =
      container.getElementsByClassName('favorite-notFilled');
    fireEvent.click(favoriteFilled[0].firstChild);
    expect(container.getElementsByClassName('country-container').length).toBe(
      1,
    );
  });
  test('should test isPinned country', () => {
    const { container } = renderWithContext(
      <CountryContainer isPinned={true} country={democountryList} />,
    );
    const favoriteFilled =
      container.getElementsByClassName('favorite-isFilled');
    fireEvent.click(favoriteFilled[0].firstChild);
    expect(container.getElementsByClassName('country-container').length).toBe(
      1,
    );
  });
  test('should test tickIconClicked country', () => {
    const { container } = renderWithContext(
      <CountryContainer isPinned={true} country={democountryList} />,
    );
    const tickIconClicked = container.getElementsByClassName('Tick-icon');
    fireEvent.click(tickIconClicked[0].firstChild);
    expect(tickIconClicked[0].firstChild.textContent).toBe('Tick.svg');
  });
  test('should test pluseIconClicked  country', () => {
    const { container } = renderWithContext(
      <CountryContainer isPinned={false} country={democountryList} />,
    );
    const pluseIconClicked = container.getElementsByClassName('Pluse-Icon');
    fireEvent.click(pluseIconClicked[0].firstChild);
  });
});
