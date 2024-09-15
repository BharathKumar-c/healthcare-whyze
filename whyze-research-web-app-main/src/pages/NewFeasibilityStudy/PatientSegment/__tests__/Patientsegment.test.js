import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';
import React from 'react';
import PatientSegment from '..';
import userEvent from '@testing-library/user-event';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
const democountryList = [
  { Country: 'United Kingdom' },
  { Country: 'Albania', count: '1' },
  { Country: 'Brazil', count: '4' },
  { Country: 'Ireland', count: '4' },
];
describe('test cases for PatientSegment ', () => {
  test('should create snapshots', () => {
    const { container } = renderWithContext(<PatientSegment />);
    expect(container).toMatchSnapshot();
  });
  test('should test title', () => {
    const { container } = renderWithContext(<PatientSegment />);
    expect(
      container.getElementsByClassName(
        'ant-typography patient-segment-title',
      )[0].firstChild.textContent,
    ).toBe('Patient segment');
  });
  test('should Corrct icon render', () => {
    const { container } = renderWithContext(<PatientSegment />);
    const PatientLogo = container.getElementsByClassName('site-container-icon');
    expect(PatientLogo[0].firstChild.textContent).toBe('UserAdd.svg');
  });
  test('should user delete icon render', () => {
    const { container } = renderWithContext(<PatientSegment />);
    const PatientLogo = container.getElementsByClassName(
      'site-container-icon-grey-bg',
    );

    expect(PatientLogo[0].firstChild.textContent).toBe('UserDelete.svg');
  });
  test('sould isSearch icon is click and search country using input tag', () => {
    const { container, getByText } = renderWithContext(
      <PatientSegment tab={'feasibility'} />,
    );
    const SearchIcon = container.getElementsByClassName('search-field');
    userEvent.click(SearchIcon[0].firstChild);
    expect(getByText(/Oops, we cant find that country/i)).toBeInTheDocument();
    const countryInput = container.querySelector(
      'input[name="SearchCountries"]',
    );
    expect(countryInput.value).toMatch('');
    fireEvent.change(countryInput, { target: { value: 'ireland' } });
    expect(countryInput.value).toMatch('ireland');
  });
  test('should isSearch icon not  click ', () => {
    const { container } = renderWithContext(
      <PatientSegment tab={'feasibility'} countriesList={democountryList} />,
    );
    const testTest = container.getElementsByClassName('sub-title');

    expect(testTest[0].firstChild.textContent).toBe('Top 4 countries');
    const pinCountry = container.getElementsByClassName('country-container');
    fireEvent.click(pinCountry[0].firstChild);
    expect(testTest.length).toBe(1);
  });
  test('should pin and unpin the favorite country to the table', () => {
    const { container, getByText } = renderWithContext(
      <PatientSegment tab={'feasibility'} countriesList={democountryList} />,
    );
    const SearchIcon = container.getElementsByClassName('search-field');
    userEvent.click(SearchIcon[0].firstChild);
    // get countries-list
    const countryInput = container.querySelector(
      'input[name="SearchCountries"]',
    );

    expect(countryInput.value).toMatch('');
    fireEvent.change(countryInput, { target: { value: 'ireland' } });
    expect(countryInput.value).toMatch('ireland');
    const favoriteNotFilled =
      container.getElementsByClassName('favorite-notFilled');

    expect(getByText(/ireland/i)).toBeInTheDocument();

    //pin selected country
    fireEvent.click(favoriteNotFilled[0].firstChild);
    expect(container.getElementsByClassName('country-container').length).toBe(
      1,
    );
    const Pinnedelements = container.getElementsByClassName(
      'pinned-country-container',
    );

    expect(Pinnedelements[0].firstChild.textContent).toBe(
      'Your pinned countries',
    );
    expect(Pinnedelements.length).toBe(1);
    //unpin selected country
    const favoriteFilled =
      container.getElementsByClassName('favorite-isFilled');
    fireEvent.click(favoriteFilled[0].firstChild);
    expect(container.getElementsByClassName('country-container').length).toBe(
      0,
    );
  });
  test('should test handlechnage in search country', () => {
    const { container } = renderWithContext(
      <PatientSegment tab={'feasibility'} countriesList={democountryList} />,
    );
    const SearchIcon = container.getElementsByClassName('search-field');
    userEvent.click(SearchIcon[0].firstChild);
    // countries-list
    const countryInput = container.querySelector(
      'input[name="SearchCountries"]',
    );
    fireEvent.change(countryInput, { target: { value: 'ireland' } });
    expect(countryInput.value).toBe('ireland');
  });
  test('should input notBe filled', () => {
    const { container } = renderWithContext(
      <PatientSegment tab={'feasibility'} countriesList={democountryList} />,
    );
    const SearchIcon = container.getElementsByClassName('search-field');
    userEvent.click(SearchIcon[0].firstChild);
    // countries-list
    const countryInput = container.querySelector(
      'input[name="SearchCountries"]',
    );
    fireEvent.change(countryInput, '');
    expect(countryInput.textContent).toBe('');
  });
  test('should onclick search input close', () => {
    const { container } = renderWithContext(
      <PatientSegment tab={'feasibility'} countriesList={democountryList} />,
    );
    const SearchIcon = container.getElementsByClassName('search-field');
    userEvent.click(SearchIcon[0].firstChild);
    const CloseIcon = container.getElementsByClassName('close-search-icon');
    fireEvent.click(CloseIcon[0].firstChild);
  });
});
