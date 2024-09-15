import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import React from 'react';
import ProjectSetting from '..';
function renderWithContext(element) {
  const { container, getByText, getByRole } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText, getByRole };
}

describe('create test cases for ProjectSettings', () => {
  test('create snapshots for ProjectSetting', () => {
    const { container } = renderWithContext(
      <ProjectSetting handleClickShare={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });
  test('should render text corrctly in tag ', () => {
    const handleclick = jest.fn();
    renderWithContext(<ProjectSetting handleClickShare={handleclick} />);
    const shareSelect = screen.getAllByRole('combobox');
    expect(shareSelect[0]).toBeInTheDocument();
    expect(shareSelect[0]).toHaveAttribute('aria-label', 'Select-option');
    fireEvent.change(shareSelect[0], { target: { value: 'From' } });
    expect(shareSelect[0].value).toBe('From');
    const submitButton = screen.getByTestId('share-button');
    fireEvent.click(submitButton);
    expect(handleclick).toBeCalledTimes(1);
  });
  test('should trigger save button to save the project', () => {
    const handleclick = jest.fn();
    const { container } = renderWithContext(
      <ProjectSetting handleClickShare={handleclick} />,
    );
    const submitButton = container.getElementsByClassName('share-button');
    fireEvent.click(submitButton[0]);
    expect(handleclick).toBeCalledTimes(1);
  });
  test('should check tagRender Corrctly', () => {
    const handleclick = jest.fn();
    const { container } = renderWithContext(
      <ProjectSetting handleClickShare={handleclick} />,
    );
    const shareSelect = screen.getAllByRole('combobox');
    expect(shareSelect[0]).toBeInTheDocument();
    expect(shareSelect[0]).toHaveAttribute('aria-label', 'Select-option');
    fireEvent.click(shareSelect[0]);
    fireEvent.change(shareSelect[0], { target: { value: 'CR' } });

    const option = screen.getByTitle('CR');
    fireEvent.click(option);
    expect(shareSelect[0].value).toBe('');
    const tegRender = container.getElementsByClassName('tag-container');
    expect(tegRender[0]).toBeInTheDocument();
  });
});
