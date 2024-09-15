import { Tree } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Switch } from '../../basic';
import { totalPatientFormatter } from '../../../utils/calculations';
import './tree.scss';

const Treecomponent = ({
  treeData,
  children,
  checkable,
  onExpand,
  onCheck,
  onSelect,
  selectedKeys,
  checkedKeys,
  showLine,
  title,
  switcherIcon,
  className,
}) => {
  const [titlechange, setTitleChange] = useState([]);

  const data = [...treeData];
  if (title !== 'Location') {
    const selectedData = (data) => {
      const val = Array.isArray(data);

      if (val) {
        data.forEach((element, index) => {
          data[index] = {
            ...element,

            icon: (
              <div className="icons-wrapper">
                <span>{totalPatientFormatter(element.count || 0)}</span>
                <Switch
                  size={'small'}
                  onChange={() => {
                    const newTitleChange = [...titlechange];
                    if (newTitleChange?.includes(element?.key)) {
                      const findIndex = newTitleChange?.findIndex(
                        (ele) => ele === element?.key,
                      );
                      newTitleChange?.splice(findIndex, 1);
                    } else {
                      newTitleChange?.push(element?.key);
                    }
                    setTitleChange(newTitleChange);
                  }}
                  checked={titlechange.includes(element?.key) ? false : true}
                />
              </div>
            ),

            disabled: titlechange.includes(element?.key) ? true : false,
          };

          if (Array.isArray(element.children)) {
            selectedData(element.children);
          }
        });
      }
    };

    if (data) {
      selectedData(data);
    }
  }

  return (
    <>
      <Tree
        className={className}
        checkable={checkable}
        defaultExpandAll={true}
        showLine={showLine}
        showIcon
        switcherIcon={switcherIcon}
        treeData={data}
        onExpand={onExpand}
        autoExpandParent
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
      >
        {children}
      </Tree>
    </>
  );
};

Treecomponent.propTypes = {
  treeData: PropTypes.array,
  expandedKeys: PropTypes.array,
  checkedKeys: PropTypes.array,
  selectedKeys: PropTypes.array,
  checkable: PropTypes.bool,
  autoExpandParent: PropTypes.bool,
  showLine: PropTypes.bool,
  onExpand: PropTypes.func,
  onCheck: PropTypes.func,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  switcherIcon: PropTypes.node,
};
Treecomponent.defaultProps = {
  children: null,
  switcherIcon: null,
  autoExpandParent: false,
  checkable: false,
  draggable: false,
  showLine: false,
  expandedKeys: [],
  treeData: [],
  checkedKeys: [],
  selectedKeys: [],
  onCheck: () => {},
  onExpand: () => {},
  onSelect: () => {},
  className: '',
};
export default Treecomponent;
