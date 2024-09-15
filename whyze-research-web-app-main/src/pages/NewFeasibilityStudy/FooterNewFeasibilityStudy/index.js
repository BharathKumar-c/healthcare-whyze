import React from 'react';
import './FooterNewFeasibilityStudy.scss';
import { Button } from '../../../components/basic';
import { useSelector, useDispatch } from 'react-redux';
import { setSegments } from '../../../redux/reducer/feasibilityStudyReducer';
import useSaveandCloseService from './SaveAndClose/useSaveandCloseService';
import { useNavigate } from 'react-router-dom';
import { RoutesUrls } from '../../../constant/RoutesUrls';
import { clearSettings } from '../../../redux/reducer/projectsReducer';
import { resetSegments } from '../../../redux/reducer/feasibilityStudyReducer';
import { filterSelectedCountries } from '../../../utils/Formatter';

const FooterNewFeasibilityStudy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveUserProject } = useSaveandCloseService();
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const newTabs = segments[activeSegment.index]?.tabs;
  const { sites, activeTab, patientCount, selectedCountries } =
    segments[activeSegment.index];

  const handleSave = () => {
    saveUserProject();
    dispatch(clearSettings());
    dispatch(resetSegments());
  };

  const handleCancel = () => {
    navigate(`/${RoutesUrls.dashBoardUrl}`);
    dispatch(resetSegments());
    dispatch(clearSettings());
  };

  const handleNext = () => {
    const data = JSON.parse(JSON.stringify(newTabs));
    const newSegments = JSON.parse(JSON.stringify(segments));
    if (newSegments[activeSegment?.index].activeTab?.name === 'feasibility') {
      const { location, selectedCountries } = newSegments[activeSegment?.index];
      if (
        selectedCountries &&
        selectedCountries?.length > 0 &&
        location &&
        location?.length > 0
      ) {
        const resetedSelectedCountries = filterSelectedCountries(
          location,
          selectedCountries,
        );

        newSegments[activeSegment?.index].selectedCountries =
          resetedSelectedCountries;
      }
    }

    for (var i in data) {
      if (data[i].isActive) {
        data[i].isActive = false;
        data[i].position = 'left';
      }
      if (newSegments[activeSegment.index].activeTab.index + 1 === Number(i)) {
        data[i].isActive = true;
      }
    }
    if (newSegments[activeSegment.index].activeTab.index + 1 === data.length) {
      switch (data.length) {
        case 1:
          data.push({
            name: 'location',
            title: 'Location',
            isActive: true,
            position: 'left',
          });
          break;
        case 2:
          data.push({
            name: 'sites',
            title: 'Sites',
            isActive: true,
            position: 'left',
          });
          break;
        case 3:
          data.push({
            name: 'preferredList',
            title: 'Preferred List',
            isActive: true,
            position: 'left',
          });
          break;
        default:
          null;
          break;
      }
      newSegments[activeSegment.index].activeTab = {
        name: data[data.length - 1].name,
        index: data.length - 1,
      };
    } else {
      newSegments[activeSegment.index].activeTab = {
        name: data[newSegments[activeSegment.index].activeTab.index + 1].name,
        index: newSegments[activeSegment.index].activeTab.index + 1,
      };
    }
    newSegments[activeSegment.index].tabs = data;

    dispatch(setSegments(newSegments));
  };

  return (
    <>
      <div className="feasibility-study-footer-container">
        <Button
          label={'Cancel'}
          size={'large'}
          handleButtonClick={handleCancel}
        />
        <Button
          className={'new-feasibility-footer-btn'}
          label={'Save and close'}
          size={'large'}
          handleButtonClick={() => handleSave()}
        />
        <Button
          handleButtonClick={
            segments[activeSegment.index]?.activeTab?.index === 3
              ? null
              : handleNext
          }
          disabled={
            (activeTab?.name === 'location' &&
              selectedCountries?.length === 0) ||
            (activeTab?.name === 'feasibility' &&
              patientCount?.feasibility === 0) ||
            (activeTab?.name === 'location' &&
              (!sites || Object.keys(sites)?.length === 0))
          }
          label={'Next'}
          size={'large'}
        />
      </div>
    </>
  );
};
export default FooterNewFeasibilityStudy;
