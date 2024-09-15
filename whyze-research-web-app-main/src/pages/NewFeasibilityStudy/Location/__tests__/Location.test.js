import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import Location from '..';
import store from '../../../../redux/store';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
describe('Test cases for Location', () => {
  test('Create the snapshots for Location', () => {
    const { container } = renderWithContext(<Location />);

    expect(container).toMatchSnapshot();
  });

  test('Should render the title and logo correctly', () => {
    const { container } = renderWithContext(<Location />);
    const titleText = screen.getByText('Location');
    const titleComponent = container.getElementsByClassName(
      'ant-card-head-title',
    );

    expect(titleText).toBeInTheDocument();
    expect(titleText).toHaveStyle('font-size: 24px');
    expect(titleComponent[0].textContent).toContain('LocationIcon.svg');
    expect(titleComponent[0].textContent).toContain('Inclusion');
  });

  test('Should work the expand and collapse correctly when click the down arrow', () => {
    const { container } = renderWithContext(<Location />);
    const images = screen.getAllByRole('img');
    const caretDown = images[0];
    fireEvent.click(caretDown);
    const africaTestCityText = container.getElementsByClassName(
      'ant-tree-treenode-switcher-close',
    );
    expect(africaTestCityText[0].textContent).toContain('Africa');
    expect(africaTestCityText[0].textContent).not.toContain('Africa test city');
  });

  test('Should work the check and uncheck correctly when click the checkbox', () => {
    const { container } = renderWithContext(<Location />);
    const checkBoxes = container.getElementsByClassName(
      'ant-tree-checkbox-inner',
    );
    fireEvent.click(checkBoxes[1]);
    const checkedElement = container.getElementsByClassName(
      'ant-tree-treenode ant-tree-treenode-switcher-open ant-tree-treenode-checkbox-checked',
    );

    const titleElement = container.getElementsByClassName(
      'ant-tree-treenode ant-tree-treenode-switcher-open ant-tree-treenode-checkbox-indeterminate',
    );
    expect(checkedElement[0].textContent).toEqual('Africa test city - 1');
    expect(titleElement[0].textContent).toEqual('Africa (9,573)');

    fireEvent.click(checkBoxes[1]);
    const uncheckedElement = container.getElementsByClassName(
      'ant-tree-treenode ant-tree-treenode-switcher-open',
    );
    expect(uncheckedElement[0].textContent).toEqual('Africa (9,573)');
    expect(uncheckedElement[1].textContent).toEqual('Africa test city - 1');
  });

  test('Should checked all child elements when click parent element checkbox', () => {
    const { container } = renderWithContext(<Location />);
    const checkBoxes = container.getElementsByClassName(
      'ant-tree-checkbox-inner',
    );
    const parentCheckBox = checkBoxes[0];
    fireEvent.click(parentCheckBox);

    const checkedElement = container.getElementsByClassName(
      'ant-tree-treenode ant-tree-treenode-switcher-open ant-tree-treenode-checkbox-checked',
    );

    const titleElement = container.getElementsByClassName(
      'ant-tree-treenode ant-tree-treenode-switcher-open ant-tree-treenode-checkbox-checked',
    );

    expect(checkedElement.length).toEqual(4);
    expect(titleElement[0].textContent).toEqual('Africa (9,573)');

    fireEvent.click(checkBoxes[1]);

    const indeterminatedTitleElement = container.getElementsByClassName(
      'ant-tree-treenode ant-tree-treenode-switcher-open ant-tree-treenode-checkbox-indeterminate',
    );

    expect(indeterminatedTitleElement[0].textContent).toEqual('Africa (9,573)');
  });

  test('Should checked the parent element when checked the all child elements', () => {
    const { container } = renderWithContext(<Location />);
    const checkBoxes = container.getElementsByClassName(
      'ant-tree-checkbox-inner',
    );
    const child1 = checkBoxes[1];
    const child2 = checkBoxes[2];
    const child3 = checkBoxes[3];

    fireEvent.click(child1);
    fireEvent.click(child2);
    fireEvent.click(child3);

    const checkedElement = container.getElementsByClassName(
      'ant-tree-treenode ant-tree-treenode-switcher-open ant-tree-treenode-checkbox-checked',
    );
    expect(checkedElement.length).toEqual(4);
    expect(checkedElement[0].textContent).toEqual('Africa (9,573)');
    expect(checkedElement[1].textContent).toEqual('Africa test city - 1');
    expect(checkedElement[2].textContent).toEqual('Africa test city - 2');
    expect(checkedElement[3].textContent).toEqual('Africa test city - 3');
  });

  // now it's not neccessary, in future we can use it

  //   test('Check onSelect function when click the element', () => {
  //     const { container } = renderWithContext(<Location />);

  //     const africaTestCity1 = screen.getByTitle('Africa test city - 1');

  //     fireEvent.click(africaTestCity1);

  //     const selectedElement = container.getElementsByClassName(
  //       'ant-tree-node-content-wrapper ant-tree-node-content-wrapper-normal ant-tree-node-selected',
  //     );

  //     expect(selectedElement[0].textContent).toBe('Africa test city - 1');
  //   });
});
