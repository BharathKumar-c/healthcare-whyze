import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
const DragDropComponenet = ({ listItems }) => {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [list, setList] = useState(listItems);

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    console.log(e);
    const copyListItems = [...list];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(copyListItems);
  };

  return (
    <>
      {list &&
        list.map((item, index) => (
          <div
            className="drag-drop-container"
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            key={index}
            draggable
          >
            {item.gender}
          </div>
        ))}
    </>
  );
};

DragDropComponenet.propTypes = {
  listItems: PropTypes.array,
};

DragDropComponenet.defalutProps = {
  listItems: [],
};
export default DragDropComponenet;
