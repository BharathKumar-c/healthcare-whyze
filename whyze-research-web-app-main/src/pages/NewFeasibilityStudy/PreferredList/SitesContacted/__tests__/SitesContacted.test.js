import { fireEvent, render } from '@testing-library/react';
import SitesContactedTab from '..';
import React from 'react';
import Store from '../../../../../redux/store';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={Store}>{element}</Provider>,
  );
  return { container, Store, getByText };
}
const demoSites = {
  id: 3,
  isChecked: true,
  isLinked: false,
  location: 'London, UK',
  noOfConnectedSites: 87,
  noOfNotConnectedSites: 6,
  star: 4.1,
  university: 'University College Hospital at Westmoreland Street',
};
const demoWithLinkedSites = {
  id: 4,
  isChecked: false,
  isLinked: true,
  location: 'Cork, Ireland',
  noOfLinks: 1,
  linkedData: [
    {
      location: 'Dublin, Ireland',
      name: 'Cork University',
      noOfConnectedSites: 35,
      noOfNotConnectedSites: 11,
      star: 3.9,
    },
  ],
  noOfConnectedSites: 87,
  noOfNotConnectedSites: 7,
  star: 3.7,
  university: 'Cork University Hospital',
};
const demoWithmanyLinkendSites = {
  id: 4,
  isChecked: false,
  isLinked: true,
  location: 'Cork, Ireland',
  noOfLinks: 3,
  linkedData: [
    {
      location: 'Dublin, Ireland',
      name: 'Cork University',
      noOfConnectedSites: 35,
      noOfNotConnectedSites: 11,
      star: 3.9,
    },
    {
      location: 'Dublin, Ireland',
      name: 'Cork University',
      noOfConnectedSites: 35,
      noOfNotConnectedSites: 11,
      star: 3.9,
    },
  ],
  noOfConnectedSites: 87,
  noOfNotConnectedSites: 7,
  star: 3.7,
  university: 'Cork University Hospital',
};
describe('test cases for SitesContactedTab ', () => {
  test('create snapshots for SitesContactedTab', () => {
    const { container } = renderWithContext(<SitesContactedTab />);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sitesContacted.push(demoSites);

      Store.dispatch(setSegments(segments));
    });
    expect(container).toMatchSnapshot();
  });

  test('should linked sites expand click & render all linked sites count ', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'preferredSites';
        }}
      />,
    );
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sitesContacted.push(demoWithLinkedSites);

      Store.dispatch(setSegments(segments));
    });
    const Checkbox = container.getElementsByClassName(
      'preferred-list-children-wrapper-linked',
    );
    fireEvent.click(Checkbox[0].firstChild);
    expect(Checkbox[0].lastChild.textContent).toBe('1 linked site');
  });
  test('should linked sites expand click & render all linked sites many count ', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'preferredSites';
        }}
      />,
    );
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sitesContacted.push(
        demoWithmanyLinkendSites,
      );

      Store.dispatch(setSegments(segments));
    });
    const Checkbox = container.getElementsByClassName(
      'preferred-list-children-wrapper-linked',
    );
    fireEvent.click(Checkbox[0].firstChild);

    expect(Checkbox[1].lastChild.textContent).toBe('3 linked sites');
  });
  test('should expand the sites using Arrow key down', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'sitesInitiated';
        }}
      />,
    );
    const DownArrow = container.getElementsByClassName('ArrowDown-toggle');

    fireEvent.click(DownArrow[0].firstChild);
    expect(DownArrow[0].firstChild.textContent).toBe('Dropdown.svg');
    const UpArrow = container.getElementsByClassName('ArrowUp-toggle');

    fireEvent.click(UpArrow[0].firstChild);
  });
  test('should noofsites check corectly', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'sitesInitiated';
        }}
      />,
    );
    const getElements = container.getElementsByClassName(
      'preferred-list-children-wrapper-linked',
    );

    expect(getElements[0].lastChild.textContent).toBe('1 linked site');
  });
  test('should checked single using checkbox', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'sitesInitiated';
        }}
      />,
    );
    fireEvent.click(
      container.getElementsByClassName('handleChecked-checkbox')[0].firstChild,
    );
    expect(container).toBeInTheDocument();
  });
  test('should checked alldata using checkbox', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'sitesInitiated';
        }}
      />,
    );
    const preferredSitesChangeTab = container.getElementsByClassName(
      'preferred-list-children-wrapper-info',
    );

    fireEvent.click(preferredSitesChangeTab[1].firstChild);
    fireEvent.click(
      container.getElementsByClassName('preferred-list-checkbox')[0].firstChild,
    );
    expect(container).toBeInTheDocument();
  });
  test('should using icon for change contacted to prefferedSites', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'sitesInitiated';
        }}
      />,
    );

    const preferredListCheckbox = container.getElementsByClassName(
      'sitesPreferred-trigger',
    );

    fireEvent.click(preferredListCheckbox[0].firstChild);
  });
  test('should using icon for change contacted to prefferedSites', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'sitesInitiated';
        }}
      />,
    );
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sitesContacted.push(demoSites);

      Store.dispatch(setSegments(segments));
    });
    const preferredListCheckbox = container.getElementsByClassName(
      'sitesInitiated-trigger',
    );

    fireEvent.click(preferredListCheckbox[0].firstChild);
  });
  test('should trigger onClickCheckedInitiatedData ', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'preferredSites';
        }}
      />,
    );
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sitesContacted.push(demoSites);

      Store.dispatch(setSegments(segments));
    });
    const preferredListCheckbox = container.getElementsByClassName(
      'handleChecked-checkbox',
    );

    fireEvent.click(preferredListCheckbox[0]);
    const preferredList = container.getElementsByClassName(
      'preferred-list-option-alignment',
    );

    fireEvent.click(preferredList[2].firstChild);
  });
  test('should trigger onClickCheckedInitiatedData ', () => {
    const { container } = renderWithContext(
      <SitesContactedTab
        onTabChange={() => {
          'preferredSites';
        }}
      />,
    );
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sitesContacted.push(demoSites);

      Store.dispatch(setSegments(segments));
    });
    const preferredListCheckbox = container.getElementsByClassName(
      'handleChecked-checkbox',
    );

    fireEvent.click(preferredListCheckbox[0]);
    const preferredList = container.getElementsByClassName(
      'preferred-list-option-alignment',
    );

    fireEvent.click(preferredList[1].firstChild);
  });
});
