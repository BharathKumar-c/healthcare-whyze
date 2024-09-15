import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../../redux/store';
import React from 'react';
import SelectedPeoples from '..';
function renderWithContext(element) {
  const { container, getByText, getByRole } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText, getByRole };
}

describe('create test cases for SelectedPeoples', () => {
  test('create snapshots for SelectedPeoples', () => {
    const { container } = renderWithContext(<SelectedPeoples />);
    expect(container).toMatchSnapshot();
  });
  test('should triggers checkbox', () => {
    const { container, getByRole } = renderWithContext(<SelectedPeoples />);
    const clickCheckBox = getByRole('checkbox');
    fireEvent.click(clickCheckBox);
    expect(container).toMatchSnapshot();
  });
  test('should check tagrender', () => {
    const { container } = renderWithContext(<SelectedPeoples />);
    const shareSelect = screen.getAllByRole('combobox');
    expect(shareSelect[0]).toBeInTheDocument();
    expect(shareSelect[0]).toHaveAttribute(
      'aria-label',
      'Add-people-ariaLabel',
    );
    fireEvent.click(shareSelect[0]);
    fireEvent.change(shareSelect[0], { target: { value: 'CR' } });

    const option = screen.getByTitle('CR');
    fireEvent.click(option);
    expect(shareSelect[0].value).toBe('');
    const tegRender = container.getElementsByClassName('tag-container');
    expect(tegRender[0]).toBeInTheDocument();
  });
});

// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import SelectedPeoples from '..';

// describe('SelectedPeoples', () => {

// });
