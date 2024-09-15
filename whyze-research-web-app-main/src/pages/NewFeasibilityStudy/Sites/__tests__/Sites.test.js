import { Provider } from 'react-redux';
import React from 'react';
import store from '../../../../redux/store';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Sites from '..';
import SitesInformationModal from '../SitesInformationModal';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const demoSites = {
  id: 1,
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
  star: 3.0,
  location: 'Dublin, Ireland',
};
const demoWithLinkedSites = {
  id: 2,
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
  noOfLinks: 2,
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

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
describe('test cases for Sites ', () => {
  test('should sites Snapshot test', () => {
    const { container } = renderWithContext(<Sites />);

    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sites.push(demoSites);
      store.dispatch(setSegments(segments));
    });

    expect(container).toMatchSnapshot();
  });
  test('should heading check', () => {
    const { container } = renderWithContext(<Sites />);
    const heading = container.getElementsByClassName('sites-title-card');
    expect(heading[0].firstChild.textContent).toBe('Sites');
    const sitesImg = container.getElementsByClassName(
      'sites-title-card-description-sites',
    );
    expect(sitesImg[0]).toBeInTheDocument();
    expect(sitesImg[1]).toBeInTheDocument();
    expect(sitesImg[2]).toBeInTheDocument();
    expect(sitesImg[3]).toBeInTheDocument();
  });
  test('should render filter check', () => {
    const { container } = renderWithContext(<Sites />);
    const filterElement = container.getElementsByClassName('filter-box');
    expect(filterElement[0]).toBeInTheDocument();
  });
  test('should render children', () => {
    const { container } = renderWithContext(<Sites />);
    const sitesChildren = container.getElementsByClassName(
      'sites-children-body',
    );
    expect(sitesChildren[0]).toBeInTheDocument();
  });
  test('should linked sites expand click & render all linked sites count ', () => {
    const { container, store } = renderWithContext(<Sites />);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sites.push(demoWithLinkedSites);

      store.dispatch(setSegments(segments));
    });
    const linkedSites = container.getElementsByClassName(
      'sites-children-wrapper-linked',
    );

    fireEvent.click(linkedSites[3]);
    expect(linkedSites[3].textContent).toContain('1 linked site');
  });

  test('should linked sites expand click & render all linked sites many count ', () => {
    const { container, store } = renderWithContext(<Sites />);
    act(() => {
      const { segments, activeSegment } = JSON.parse(
        JSON.stringify(store.getState().feasibilityStudyReducer),
      );
      segments[activeSegment.index].sites.push(demoWithmanyLinkendSites);

      store.dispatch(setSegments(segments));
    });
    const linkedSites = container.getElementsByClassName(
      'sites-children-wrapper-linked',
    );

    fireEvent.click(linkedSites[0].firstChild);
    expect(linkedSites[0].textContent).toContain('2 linked sites');
  });

  test('Add icon render and onclick', () => {
    const { container } = renderWithContext(<Sites />);
    const addIconElement = container.getElementsByClassName(
      'sites-children-wrapper-add-icon',
    );
    expect(addIconElement[0]).toBeInTheDocument();
    fireEvent.click(addIconElement[0]);
  });
});

describe('test cases for Sites information modal', () => {
  test('Should render the close icon correctly', () => {
    const onClose = jest.fn();
    renderWithContext(
      <SitesInformationModal
        isOpen={true}
        onClose={onClose}
        sitesdetails={demoSites}
      />,
    );
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons[0];

    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(onClose).toBeCalledTimes(1);
  });

  test('Add button and onclick functionality ', async () => {
    const { container } = renderWithContext(<Sites />);
    const addIconElement = container.getElementsByClassName(
      'sites-children-wrapper-add-icon',
    );
    expect(addIconElement[0]).toBeInTheDocument();
    fireEvent.click(addIconElement[0]);
    const buttons = screen.getAllByRole('button');
    expect(buttons[3]).toBeInTheDocument();
    fireEvent.click(buttons[3]);

    await waitFor(() => {
      const { segments, activeSegment } =
        store.getState().feasibilityStudyReducer;

      expect(
        segments[activeSegment.index]?.preferredSites.length,
      ).toBeGreaterThan(0);
    });
  });
});
