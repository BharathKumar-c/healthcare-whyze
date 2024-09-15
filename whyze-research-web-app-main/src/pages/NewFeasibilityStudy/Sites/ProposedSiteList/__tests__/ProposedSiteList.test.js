import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

import store from '../../../../../redux/store';
import ProposedSiteList from '..';
import { proposedSiteListConstants } from '../../../../../constant/ConstantTexts';
import { setSegments } from '../../../../../redux/reducer/feasibilityStudyReducer';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}

const proposedSiteListdata = [
  {
    id: 6,
    university: 'The Mater Misericordiae University Hospital',
    isLinked: true,
    isChecked: false,
    linkedData: [
      {
        name: 'The Mater Private',
        noOfConnectedSites: 41,
        noOfNotConnectedSites: 2,
        star: 3.3,
        location: 'Dublin, Ireland',
      },
      {
        name: 'The Mater Private',
        noOfConnectedSites: 49,
        noOfNotConnectedSites: 2,
        star: 3.2,
        location: 'Cork, Ireland',
      },
    ],
    noOfLinks: 2,
    noOfConnectedSites: 231,
    noOfNotConnectedSites: 17,
    star: '3.0',
    location: 'Dublin, Ireland',
  },
  {
    id: 7,
    university: 'Hammersmith Hospital',
    isLinked: false,
    isChecked: false,
    noOfConnectedSites: 183,
    noOfNotConnectedSites: 12,
    star: '4.2',
    location: 'London, UK',
  },
  {
    id: 8,
    university: 'University College Hospital at Westmoreland Street',
    isLinked: false,
    isChecked: false,
    noOfConnectedSites: 87,
    noOfNotConnectedSites: 6,
    star: '4.1',
    location: 'London, UK',
  },
  {
    id: 9,
    university: 'Cork University Hospital',
    isLinked: true,
    isChecked: false,
    linkedData: [
      {
        name: 'Cork University',
        noOfConnectedSites: 35,
        noOfNotConnectedSites: 11,
        star: 3.9,
        location: 'Dublin, Ireland',
      },
    ],
    noOfLinks: 1,
    noOfConnectedSites: 107,
    noOfNotConnectedSites: 7,
    star: '3.7',
    location: 'Cork, Ireland',
  },
];

describe('Test cases for proposed site list', () => {
  test('Create the snapshots for proposed site list', () => {
    const { container } = renderWithContext(<ProposedSiteList />);

    expect(container).toMatchSnapshot();
  });

  test('Should render the title correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const titleText = container.getElementsByClassName(
      'proposed-site-list-title',
    );

    expect(titleText[0].textContent).toEqual(proposedSiteListConstants.title);
  });

  test('Should render the patient icon correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const vectorIcon = container.getElementsByClassName(
      'proposed-site-list-icon',
    );

    expect(vectorIcon[0].textContent).toBe('Vector.svg');
  });

  test('Should show zero for the patient count correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const vectorIcon = container.getElementsByClassName(
      'proposed-site-list-text',
    );

    expect(vectorIcon[0].textContent).toBe('00');
  });

  test('Should render the site icon correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const siteIcon = container.getElementsByClassName(
      'proposed-site-list-icon',
    );

    expect(siteIcon[1].textContent).toBe('Sites.svg');
  });

  test('Should show zero for  the sites count correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const vectorIcon = container.getElementsByClassName(
      'proposed-site-list-text',
    );

    expect(vectorIcon[1].textContent).toBe('00');
  });

  test('Should render the see more text correctly', () => {
    renderWithContext(<ProposedSiteList />);
    const seeeMoreText = screen.getByText(proposedSiteListConstants.seeMore);
    expect(seeeMoreText).toHaveClass('proposed-site-list-seemore-text');
  });

  test('Check the see more onclick function', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const seeMoreText = container.getElementsByClassName(
      'proposed-site-list-seemore-button',
    );
    expect(seeMoreText[0]).toBeInTheDocument();
  });

  test('Should render the text for empty proposed site list', () => {
    renderWithContext(<ProposedSiteList />);
    const emptyText = screen.getByText(proposedSiteListConstants.emptyContent);

    expect(emptyText).toBeInTheDocument();
  });

  test('Update Proposed site list', () => {
    const { store } = renderWithContext(<ProposedSiteList />);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );

      segments[activeSegment.index].preferredSites = proposedSiteListdata;
      store.dispatch(setSegments(segments));
    });
  });

  test('Should render the Sites icon correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const siteIcon = container.getElementsByClassName(
      'proposed-site-list-icon',
    );

    expect(siteIcon[0].textContent).toContain('Sites.svg');
  });

  test('Should show the No of Sites correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const noOfSites = container.getElementsByClassName(
      'proposed-site-list-text-active',
    );

    expect(noOfSites[0].textContent).toEqual('4');
  });

  test('Should render the user add icon correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const userAddIcon = container.getElementsByClassName(
      'proposed-site-list-icon',
    );

    expect(userAddIcon[1].textContent).toContain('UserAdd.svg');
  });

  test('Should show the No of connect patient count correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const noOfConnectedSites = container.getElementsByClassName(
      'proposed-site-list-text-active',
    );

    expect(noOfConnectedSites[1].textContent).toEqual('608');
  });

  test('Should render the user delete icon correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const userDeleteIcon = container.getElementsByClassName(
      'proposed-site-list-icon',
    );

    expect(userDeleteIcon[2].textContent).toContain('UserDelete.svg');
  });

  test('Should show the No of connect patient count correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const noOfNotConnectedSites = container.getElementsByClassName(
      'proposed-site-list-text-active',
    );

    expect(noOfNotConnectedSites[2].textContent).toEqual('42');
  });

  test('Check sites to proposed sites page tab', () => {
    const { container } = renderWithContext(<ProposedSiteList />);

    const seeMoreBotton = container.getElementsByClassName(
      'proposed-site-list-seemore-button-active',
    );
    userEvent.click(seeMoreBotton[0]);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );

      expect(segments[activeSegment.index].activeTab).toEqual({
        name: 'preferredList',
        index: 3,
      });
    });

    expect(seeMoreBotton[0].textContent).toContain('RightArrow.svg');
  });

  test('Should render the see more text with active style correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const seeMoreText = container.getElementsByClassName(
      'proposed-site-list-seemore-text-active',
    );

    expect(seeMoreText[0]).toBeInTheDocument();
  });

  test('Add the tabs in feasibilitystudy', () => {
    const { store } = renderWithContext(<ProposedSiteList />);
    const tabs = [
      {
        name: 'feasibility',
        title: 'Feasibility',
        isActive: false,
        position: 'left',
      },
      {
        name: 'location',
        title: 'location',
        isActive: false,
        position: 'left',
      },
      {
        name: 'sites',
        title: 'sites',
        isActive: true,
        position: 'left',
      },
      {
        name: 'preferredList',
        title: 'preferredList',
        isActive: false,
        position: 'right',
      },
    ];

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );

      segments[activeSegment.index].tabs = tabs;
      segments[activeSegment.index].activeTab = {
        name: 'sites',
        index: 2,
      };
      store.dispatch(setSegments(segments));
    });
  });

  test('Check sites to proposed sites tab with four tabs', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const seeMoreText = container.getElementsByClassName(
      'proposed-site-list-seemore-text-active',
    );

    userEvent.click(seeMoreText[0]);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );

      expect(segments[activeSegment.index].activeTab).toEqual({
        name: 'preferredList',
        index: 3,
      });
    });
  });

  test('Should render the university name correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);

    const universitiesNames = container.getElementsByClassName(
      'proposed-site-list-site-name',
    );

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );

      segments[activeSegment.index].preferredSites.forEach((ele, index) => {
        expect(universitiesNames[index].textContent).toEqual(ele.university);
      });
    });
  });

  test('Should render close icons correctly', () => {
    const { container } = renderWithContext(<ProposedSiteList />);
    const closeIcon = container.getElementsByClassName(
      'proposed-site-list-close-icon',
    );

    expect(closeIcon[0].textContent).toEqual('CloseIcon.svg');
  });

  test('Check the Click function in close icons', () => {
    renderWithContext(<ProposedSiteList />);
    const closeIcon = screen.getAllByText('CloseIcon.svg');

    userEvent.click(closeIcon[0]);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      expect(segments[activeSegment.index].preferredSites.length).toEqual(3);
    });
  });
});
