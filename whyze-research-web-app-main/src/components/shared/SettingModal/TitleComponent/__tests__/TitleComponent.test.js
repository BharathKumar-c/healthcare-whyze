import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import React from 'react';
import Title from '..';
function renderWithContext(element) {
  const { container, getByText, getByRole } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText, getByRole };
}
describe('create test cases for TitleComponent', () => {
  test('should title render with project setting title', () => {
    renderWithContext(<Title title={'Project settings'} />);
    const HeaderTitle = screen.getByText('Project settings');
    expect(HeaderTitle.textContent).toBe('Project settings');
  });
  test('should title render with Link title', () => {
    const onBack = jest.fn();
    const { container } = renderWithContext(
      <Title title={'Share project link'} isSubComp={true} onBack={onBack} />,
    );
    const HeaderTitle = screen.getByText('Share project link');
    const backBtn = container.getElementsByClassName('modal-title-back');
    fireEvent.click(backBtn[0]);
    expect(onBack).toBeCalledTimes(1);
    expect(onBack).toBeCalledWith('Share project link');
    expect(HeaderTitle.textContent).toBe('Share project link');
  });
});
