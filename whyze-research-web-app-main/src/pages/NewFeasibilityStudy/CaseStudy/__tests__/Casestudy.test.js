import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';
import React from 'react';
import CaseStudy from '..';

function renderWithContext(element) {
  const { container } = render(<Provider store={store}>{element}</Provider>);
  return { container, store };
}

describe('create snapshot for CaseStudy', () => {
  test('create snapshots', () => {
    const { container } = renderWithContext(<CaseStudy value={2000} />);
    expect(container).toMatchSnapshot();
  });
});
