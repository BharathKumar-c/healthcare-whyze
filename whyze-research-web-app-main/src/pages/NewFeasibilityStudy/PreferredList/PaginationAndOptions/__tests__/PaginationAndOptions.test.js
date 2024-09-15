import { fireEvent, render } from '@testing-library/react';
import PaginationAndOptions from '..';
import React from 'react';
import Store from '../../../../../redux/store';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';

function renderWithContext(element) {
  const { container } = render(<Provider store={Store}>{element}</Provider>);
  return { container, Store };
}
const demoSites = [
  {
    id: 3,
    isChecked: true,
    isLinked: false,
    location: 'London, UK',
    noOfConnectedSites: 87,
    noOfNotConnectedSites: 6,
    star: '4.1',
    university: 'University College Hospital at Westmoreland Street',
  },
];
describe('testcases for PaginationAndOptions', () => {
  test('create snapshots for PaginationAndOptions', () => {
    const { container } = renderWithContext(<PaginationAndOptions />);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].feasibilityStudy.push(demoSites);
      Store.dispatch(setSegments(segments));
    });
    expect(container).toMatchSnapshot();
  });
  test('test deletefunction', () => {
    const { container } = renderWithContext(<PaginationAndOptions />);
    const deleteFunction = container.getElementsByClassName(
      'preferred-list-option-alignment',
    );
    fireEvent.click(deleteFunction[0].firstChild);
    expect(deleteFunction[0].firstChild.textContent).toBe('Delete.svgDelete');
  });
  test('selected  preferredSites tab ', () => {
    const { container } = renderWithContext(
      <PaginationAndOptions tab={'preferredSites'} noOfSelectedSites={1} />,
    );

    const preferredSitescheckbox = container.querySelector(
      'input[name="sites"]',
    );

    const OptionAlignment = container.getElementsByClassName(
      'preferred-list-option-alignment',
    );

    fireEvent.click(preferredSitescheckbox);
    fireEvent.click(OptionAlignment[1].firstChild);
    const preferredListText = container.getElementsByClassName(
      'preferred-list-text',
    );

    expect(preferredListText[2].firstChild.textContent).toBe('Mark initiated');
  });
  test('selected contacted  tab ', () => {
    const { container } = renderWithContext(
      <PaginationAndOptions tab={'contacted'} noOfSelectedSites={1} />,
    );

    const OptionAlignment = container.getElementsByClassName(
      'preferred-list-option-alignment',
    );

    fireEvent.click(OptionAlignment[2].firstChild);
    fireEvent.click(OptionAlignment[1].firstChild);
    const preferredListText = container.getElementsByClassName(
      'preferred-list-text',
    );

    expect(preferredListText[2].firstChild.textContent).toBe('Mark initiated');
  });

  test('pagination arrows trigger test', () => {
    const { container } = renderWithContext(
      <PaginationAndOptions tab={'initiated'} noOfSelectedSites={1} />,
    );
    const OptionAlignment = container.getElementsByClassName(
      'preferred-list-arrow-icon',
    );

    fireEvent.click(OptionAlignment[0].firstChild);
    fireEvent.click(
      container.getElementsByClassName('preferred-list-arrow-right')[0]
        .firstChild,
    );
    expect(OptionAlignment[0].firstChild).toBeInTheDocument();
  });
  test('current page is notEqual to 1 or more', () => {
    const { container } = renderWithContext(
      <PaginationAndOptions tab={'initiated'} currentPage={2} />,
    );
    const OptionAlignment = container.getElementsByClassName(
      'preferred-list-arrow-icon',
    );

    fireEvent.click(OptionAlignment[0].firstChild);
    fireEvent.click(
      container.getElementsByClassName('preferred-list-arrow-right')[0]
        .firstChild,
    );
    expect(OptionAlignment[0].firstChild).toBeInTheDocument();
  });
  test('current page not equal to totalpage', () => {
    const { container } = renderWithContext(
      <PaginationAndOptions tab={'initiated'} currentPage={1} totalPage={2} />,
    );
    const OptionAlignment = container.getElementsByClassName(
      'preferred-list-arrow-icon',
    );

    fireEvent.click(OptionAlignment[0].firstChild);
    fireEvent.click(
      container.getElementsByClassName('preferred-list-arrow-right')[0]
        .firstChild,
    );
    expect(OptionAlignment[0].firstChild).toBeInTheDocument();
  });
});
