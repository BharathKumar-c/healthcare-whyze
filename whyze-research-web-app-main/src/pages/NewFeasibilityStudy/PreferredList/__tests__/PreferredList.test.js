import { Provider } from 'react-redux';
import React from 'react';
import Store from '../../../../redux/store';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import PreferredList from '..';
import userEvent from '@testing-library/user-event';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const Wrapper = ({ children }) => <Provider store={Store}>{children}</Provider>;
describe('test cases for PreferredList ', () => {
  test('should PreferredList Snapshot test', () => {
    const { container } = render(<PreferredList />, {
      wrapper: Wrapper,
    });
    expect(container).toMatchSnapshot();
  });
  test('should heading check', () => {
    const { container } = render(<PreferredList />, { wrapper: Wrapper });
    const Heading = container.getElementsByClassName(
      'preferred-list-title-component-title',
    );
    expect(Heading[0].firstChild.textContent).toBe('Preferred List');
  });
  test('should tab count check', () => {
    const { container } = render(<PreferredList />, { wrapper: Wrapper });
    const Heading = container.getElementsByClassName('ant-tabs-nav');
    expect(Heading[0].firstChild.textContent).toBe(
      'Preferred sitesSites contactedSites initiated',
    );
  });
  test('should onChangeTab change check ', () => {
    jest.mock();
    const { container } = render(<PreferredList />, {
      wrapper: Wrapper,
    });
    const preferredsitesBtn =
      container.getElementsByClassName('ant-tabs-tab-btn');
    userEvent.tab(preferredsitesBtn);

    expect(preferredsitesBtn[0].firstChild.textContent).toBe('Preferred sites');
    expect(preferredsitesBtn[1].lastChild.textContent).toBe('Sites contacted');
    expect(preferredsitesBtn[2].lastChild.textContent).toBe('Sites initiated');
  });
});

Wrapper.propTypes = {
  children: PropTypes.node,
};
Wrapper.defaultProps = {
  node: null,
};
