import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Treecomponenet from '../../../components/hoc/tree';
import './Location.scss';
import { Card } from '../../../components/hoc';
import NoOfPatient from '../../../components/hoc/card/NoOfPatient';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSegments } from '../../../redux/reducer/feasibilityStudyReducer';
import {
  getSelectedLocationKeys,
  locationHistoryTreeFormatter,
  updateSelectedCountries,
} from '../../../utils/Formatter';
import useLocationService from './useLocationService';

const Location = ({ location }) => {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const { getSitesList } = useLocationService();
  const dispatch = useDispatch();

  const [locationTree, setLocationTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [topCountriesTree, setTopCountryTree] = useState([]);
  const [topCountriesCheckedKeys, setTopCountriesCheckedKeys] = useState([]);
  const [isGetSites, setIsGetSites] = useState(false);

  const topCountriesList =
    location &&
    [...location]
      ?.sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, 2);

  useEffect(() => {
    const formattedLocation = locationHistoryTreeFormatter(location, true);
    const formattedTopCountries = locationHistoryTreeFormatter(
      topCountriesList,
      true,
    );
    const seletcedLocationKeys = getSelectedLocationKeys({
      locations: formattedLocation[0]?.children || [],
      selectedCountries: segments[activeSegment.index].selectedCountries,
    });

    const seletcedTopCountriesKeys = getSelectedLocationKeys({
      locations: formattedTopCountries[0]?.children || [],
      selectedCountries: segments[activeSegment.index].selectedCountries,
    });

    setCheckedKeys(seletcedLocationKeys);
    setLocationTree(formattedLocation[0]?.children || []);
    setTopCountriesCheckedKeys(seletcedTopCountriesKeys);
    setTopCountryTree(formattedTopCountries[0]?.children || []);
  }, [location]);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck = (value, isCountry) => {
    const newSegment = JSON.parse(JSON.stringify(segments));
    newSegment[activeSegment.index].selectedCountries = updateSelectedCountries(
      {
        data: isCountry
          ? newSegment[activeSegment.index].location
          : topCountriesList,
        value: value.checked,
        key: value.node.key,
        selectedCountries:
          newSegment[activeSegment.index].selectedCountries || [],
      },
    );
    setIsGetSites(true);
    dispatch(setSegments(newSegment));
  };

  useEffect(() => {
    if (isGetSites) {
      getSitesList({
        caseStudy: segments[activeSegment.index].feasibilityStudy,
        country: segments[activeSegment.index].selectedCountries,
      });
      setIsGetSites(false);
    }
  }, [isGetSites]);

  useEffect(() => {
    if (!isGetSites) {
      getSitesList({
        caseStudy: segments[activeSegment.index].feasibilityStudy,
        country: segments[activeSegment.index].selectedCountries,
      });
    }
  }, [segments[activeSegment.index]?.selectedCountries?.length > 0]);

  return (
    <Card
      title={{ case: 'Location', name: 'Location' }}
      tagtitle={'Inclusion'}
      className="location-Card"
      extra={<NoOfPatient totalpatient={0} />}
    >
      <div className="location-container">
        <div className="location-container-country-tree">
          <h3>Top countries</h3>
          {topCountriesList.length > 0 && (
            <Treecomponenet
              treeData={topCountriesTree}
              checkable
              title={'Location'}
              onCheck={(_, event) => onCheck(event, false)}
              checkedKeys={topCountriesCheckedKeys}
              showLine={false}
            />
          )}
        </div>
        <div className="location-container-country-tree">
          <h3>Countries</h3>
          <Treecomponenet
            treeData={locationTree}
            checkable
            title={'Location'}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            onCheck={(_, event) => onCheck(event, true)}
            checkedKeys={checkedKeys}
            showLine={false}
          />
        </div>
        <div></div>
      </div>
    </Card>
  );
};

Location.propTypes = {
  location: PropTypes.array,
};
Location.defaultProps = {
  location: [],
};

export default Location;
