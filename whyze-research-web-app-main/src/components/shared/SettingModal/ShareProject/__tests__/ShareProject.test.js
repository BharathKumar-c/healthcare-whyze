import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../../redux/store';
import React from 'react';
import Projectlink from '..';
function renderWithContext(element) {
  const { container, getByText, getAllByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText, getAllByText };
}
const openModalProjectSettingsNotSub = {
  isOpen: true,
  isSubComp: false,
  page: 'new-feasibility-study',
  title: 'Share project link',
  user: [
    {
      id: 1,
      image: null,
      name: 'Mathi',
      role: 'owner',
      email: 'mia.holloway@crosconsulting.com',
    },
    {
      id: 2,
      image: null,
      name: 'James',
      role: '',
      email: 'mia.holloway@crosconsulting.com',
    },
  ],
};
const openModalProjectSettingsIsSub = {
  isOpen: true,
  isSubComp: true,
  page: 'new-feasibility-study',
  title: 'Share project link',
};
describe('create test cases for ProjectSettings', () => {
  test('create snapshots for settingmodal', () => {
    const { container } = renderWithContext(
      <Projectlink props={openModalProjectSettingsNotSub} />,
    );

    expect(container).toMatchSnapshot();
  });
  // test('should project link render', () => {
  //   renderWithContext(<Projectlink props={openModalProjectSettingsNotSub} />);

  // });
  test('create snapshots for settingmodal', () => {
    const { container } = renderWithContext(
      <Projectlink props={openModalProjectSettingsIsSub} />,
    );
    expect(container).toBeInTheDocument();
  });
  test('should check users render corrctly', () => {
    const { container } = renderWithContext(
      <Projectlink
        isSubcomp={false}
        user={openModalProjectSettingsNotSub.user}
      />,
    );
    const projectWrapper = container.getElementsByClassName(
      'share-project-access-wrapper',
    );
    fireEvent.click(projectWrapper[0]);

    expect(projectWrapper[0]).toBeInTheDocument();
    const shareSelect = screen.getAllByRole('combobox');
    expect(shareSelect[2]).toBeInTheDocument();
    expect(shareSelect[2]).toHaveAttribute(
      'aria-label',
      'custom-select-projectSetting',
    );
    fireEvent.click(shareSelect[2]);
    fireEvent.change(shareSelect[2], { target: { value: 'CROs Consulting' } });

    const option = screen.getByTitle('CROs Consulting');
    fireEvent.click(option);
    expect(shareSelect[2].value).toBe('');
    // expect(shareSelect[2]).toBeCalled();
  });
  test('should check users render corrctly', () => {
    const { container } = renderWithContext(
      <Projectlink
        isSubcomp={false}
        user={openModalProjectSettingsNotSub.user}
      />,
    );
    const projectWrapper = container.getElementsByClassName(
      'share-project-access-wrapper',
    );
    fireEvent.click(projectWrapper[0]);

    expect(projectWrapper[0]).toBeInTheDocument();
    const shareSelect = screen.getAllByRole('combobox');
    expect(shareSelect[0]).toBeInTheDocument();
    expect(shareSelect[0]).toHaveAttribute('aria-label', 'share-project');
    fireEvent.click(shareSelect[0]);
    fireEvent.change(shareSelect[0], { target: { value: 'CR' } });

    const option = screen.getByTitle('CR');
    fireEvent.click(option);
    expect(shareSelect[0].value).toBe('');
  });
});
