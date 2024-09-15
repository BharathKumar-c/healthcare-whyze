import { render, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';
import Segments from '..';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { setSegments } from '../../../../redux/reducer/feasibilityStudyReducer';
import { feasibilityStudyConstant } from '../../../../constant';
function renderWithContext(element) {
  const { container, getByRole, getAllByText, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByRole, getAllByText, getByText };
}

describe('write testcases for segments', () => {
  const { segments } = store.getState().feasibilityStudyReducer;
  test('create snapshots for segments', () => {
    const { container } = renderWithContext(<Segments />);

    expect(container).toMatchSnapshot();
  });
  test('should add new  segments correctly', () => {
    const { container, store } = renderWithContext(<Segments />);

    const addIconBtn = container.getElementsByClassName('segment-add-icon');

    fireEvent.click(addIconBtn[0]);
    act(() => {
      const caseStudy = [...segments];
      caseStudy.push({
        name: `Segment-${caseStudy.length + 1} `,
        isDone: false,
        activeTab: {
          name: 'feasibility',
          index: 0,
        },
        tabs: [
          {
            name: 'feasibility',
            title: 'Feasibility',
            isActive: true,
            position: 'left',
          },
        ],
        feasibilityStudy: feasibilityStudyConstant,
        country: [],
      });

      store.dispatch(setSegments(caseStudy));
    });

    expect(segments.length).toBe(1);
  });
  test('should onClick segment data setTo redux correctly', () => {
    const { container } = renderWithContext(<Segments />);
    const FireEventDiv = container.getElementsByClassName('segment-layout');
    fireEvent.click(FireEventDiv[0].firstChild);
    expect(FireEventDiv[0].firstChild).toBeInTheDocument();
  });

  test('should Onclick dropdown and change options to   Mark as final ', () => {
    const { container, getAllByText } = renderWithContext(<Segments />);
    const DropDownElements = container.getElementsByClassName(
      'segments-dropdown-options',
    );

    fireEvent.click(DropDownElements[0]);
    act(() => {
      const renameOption = getAllByText(/Mark as final/i);
      fireEvent.click(renameOption[0].firstChild);
      expect(container).toBeInTheDocument();
    });
  });
  test('should Rename the segment ', () => {
    const { container, getAllByText } = renderWithContext(<Segments />);
    const DropDownElements = container.getElementsByClassName(
      'segments-dropdown-options',
    );

    fireEvent.click(DropDownElements[0]);
    act(() => {
      const renameOption = getAllByText(/Rename/i);
      fireEvent.click(renameOption[0].firstChild);
    });
    const RenameInputForm = container.querySelector(
      'input[name="segment-rename-Input"]',
    );
    userEvent.clear(RenameInputForm, '');
    userEvent.type(RenameInputForm, 'testSegmentName');
    expect(RenameInputForm.value).toBe('testSegmentName');
    const submitIcon = container.getElementsByClassName(
      'segment-rename-tick-icon',
    );
    userEvent.click(submitIcon[0]);
    const { segments, activeSegment } =
      store.getState().feasibilityStudyReducer;
    expect(segments[activeSegment.index]?.name).toBe('testSegmentName');
  });
  test('should Onclick dropdown and change options to  Make a copy ', () => {
    const { container, getAllByText } = renderWithContext(<Segments />);
    const DropDownElements = container.getElementsByClassName(
      'segments-dropdown-options',
    );

    fireEvent.click(DropDownElements[0]);
    act(() => {
      const makeACopyOption = getAllByText(/Make a copy/i);
      fireEvent.click(makeACopyOption[0].firstChild);
      expect(container).toBeInTheDocument();
    });
  });
  test('should Onclick dropdown and change options to delete', () => {
    const { container, getAllByText } = renderWithContext(<Segments />);
    const DropDownElements = container.getElementsByClassName(
      'segments-dropdown-options',
    );
    fireEvent.click(DropDownElements[0]);
    act(() => {
      const DeleteOption = getAllByText(/Delete/i);
      fireEvent.click(DeleteOption[0].firstChild);
      expect(container).toBeInTheDocument();
    });
  });
});
