import React, { useEffect, useState } from 'react';
import { Node, PopulationVector } from '../../../assets';
import PropTypes from 'prop-types';
import './History.scss';

import { useSelector } from 'react-redux';
import { Tree } from '../../../components/hoc';
import { totalPatientFormatter } from '../../../utils/calculations';
import {
  feasibilityHistoryTreeFormater,
  locationHistoryTreeFormatter,
} from '../../../utils/Formatter';

const HistoryOfChanges = (props) => {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const [historyTree, setHistoryTree] = useState([]);

  useEffect(() => {
    const selectedData = props.isLocation
      ? segments[activeSegment.index]?.selectedCountries
      : segments[activeSegment.index]?.feasibilityStudy;

    const formattedHistory = props.isLocation
      ? locationHistoryTreeFormatter(selectedData)
      : feasibilityHistoryTreeFormater(selectedData);

    const filteredSelectedData =
      props.isLocation && formattedHistory[0]?.children?.length === 0;
    setHistoryTree(filteredSelectedData ? [] : formattedHistory);
  }, [props.isLocation, segments, activeSegment]);

  return (
    <div className="HistoryOfChanges-wrapper">
      <h3>History of changes</h3>
      <div className="HistoryOfChanges-wrapper_Total-population">
        <PopulationVector />
        <p>Initial population : {totalPatientFormatter(props.allcount)}</p>
      </div>
      {props.isLocation && (
        <div className="HistoryOfChanges-wrapper_Total-population">
          <PopulationVector />
          <p>
            Feasibility segment:{' '}
            {totalPatientFormatter(props.feasibilityStudyCount)}
          </p>
        </div>
      )}

      {historyTree.map((hData, index) => {
        return (
          <div key={`${index}_${hData?.title}`}>
            <div className="HistoryOfChanges-wrapper_Initial-population">
              <p>{hData?.title}</p>
            </div>

            <div>
              {hData?.children?.length > 0 && (
                <Tree
                  treeData={hData?.children}
                  switcherIcon={<Node />}
                  showLine
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
HistoryOfChanges.propTypes = {
  allcount: PropTypes.number,
  feasibilityStudyCount: PropTypes.number,
  isLocation: PropTypes.bool,
};
HistoryOfChanges.defaultProps = {
  allcount: 0,
  feasibilityStudyCount: 0,
  isLocation: false,
};
export default HistoryOfChanges;
