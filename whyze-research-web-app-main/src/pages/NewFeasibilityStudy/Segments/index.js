import React, { useEffect, useState } from 'react';
import { totalPatientFormatter } from '../../../utils/calculations';
import { segmentDropdownItems } from '../../../constant/DropdownData/DropdownData';
import {
  CircledBlackTick,
  Options,
  Pencil,
  Tick,
  Vector,
  SegementAddIcon,
} from '../../../assets';
import {
  setActiveSegment,
  setSegments,
} from '../../../redux/reducer/feasibilityStudyReducer';
import { useSelector, useDispatch } from 'react-redux';
import { DropDown, Input, Text } from '../../../components/basic';
import AlertMessageModel from './AlertMessageModel';
import { feasibilityStudyConstant } from '../../../constant';
import useNewFeasibilityStudyService from '../useNewFeasibilityStudyService';

const Segments = () => {
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const { optimusValue } = useNewFeasibilityStudyService();

  const getTotalConnectedAndNotConnectedSites = (preferredSites) => {
    let connectedSites = preferredSites?.reduce((a, b) => {
      return a + b.connected || 0;
    }, 0);

    let notConnectedSites = preferredSites?.reduce((a, b) => {
      return a + b.not_connected_sites || 0;
    }, 0);
    let totalConnectedAndNotConnected = connectedSites + notConnectedSites;

    return totalConnectedAndNotConnected;
  };

  const [renamesegment, setRenameSegments] = useState({
    isRename: false,
    renameIndex: null,
    renameValue: activeSegment?.name,
  });
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handlAddSegment = () => {
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
      location: [],
      selectedCountries: [],
      sites: [],
      sitesContacted: [],
      sitesInitiated: [],
      preferredSites: [],
    });

    dispatch(setSegments(caseStudy));
  };
  const handleInputChange = (e) => {
    setRenameSegments({
      ...renamesegment,
      renameValue: e.target.value,
    });
  };
  const handleSelectOption = (option, index) => {
    const newSegments = JSON.parse(JSON.stringify(segments));
    if (option.key === 'delete') {
      setOpen(true);
    }
    if (option.key === 'rename') {
      setRenameSegments({
        ...renamesegment,
        renameIndex: index,
        isRename: true,
        renameValue: activeSegment?.name,
      });
    }

    if (option.key === 'markAsFinal') {
      newSegments[activeSegment.index].isDone = true;
      dispatch(setSegments(newSegments));
    }

    if (option.key === 'makeACopy') {
      const CopyOfsegments = {
        ...newSegments[activeSegment.index],
        name: `Copy of ${newSegments[activeSegment.index].name}`,
      };
      newSegments.push(CopyOfsegments);
      dispatch(setSegments(newSegments));
    }
  };

  const handleRename = () => {
    let newSegments = [...segments];
    newSegments[renamesegment.renameIndex] = {
      ...newSegments[renamesegment.renameIndex],
      name: renamesegment.renameValue,
    };
    dispatch(setSegments(newSegments));
    setRenameSegments({ ...renamesegment, isRename: false, renameIndex: null });
  };

  const handleChangeActiveSegment = (name, index) => {
    if (index !== activeSegment?.index) {
      dispatch(setActiveSegment({ name, index }));
    }
  };

  useEffect(() => {
    if (!segments[activeSegment.index].patientCount) {
      optimusValue({
        data: segments[activeSegment.index]?.feasibilityStudy,
      });
    }
  }, [activeSegment]);

  return (
    <>
      {segments?.map((segment, index) => (
        <div
          key={`${segment?.name}-${index}`}
          className="segment-layout"
          onClick={() => handleChangeActiveSegment(segment.name, index)}
        >
          <div
            className={
              segment.isDone
                ? 'segment-container-active'
                : activeSegment.index === index
                ? 'segment-container-active-notDone'
                : 'segment-container'
            }
          >
            <div className="segment-icon">
              {segment.isDone ? <CircledBlackTick /> : <Pencil />}
            </div>
            {renamesegment?.isRename && index === renamesegment?.renameIndex ? (
              <div className="segment-rename">
                <Input
                  className="segment-rename-input"
                  name={'segment-rename-Input'}
                  handleInputChange={handleInputChange}
                  value={renamesegment?.renameValue}
                />
                <div
                  className="segment-rename-tick-icon"
                  onClick={handleRename}
                >
                  <Tick />
                </div>
              </div>
            ) : (
              <Text className="segment-title" text={segment?.name} />
            )}
            <Vector className="segment-vector-icon" height={23} width={18} />
            <Text
              className="segment-no-of-patients"
              text={
                segment?.patientCount
                  ? totalPatientFormatter(
                      segment?.activeTab?.name == 'feasibility'
                        ? segment?.patientCount?.feasibility || 0
                        : segment?.activeTab?.name === 'sites' ||
                          (segment?.activeTab?.name === 'location' &&
                            segment?.patientCount?.location)
                        ? segment?.patientCount?.location
                        : segment?.activeTab?.name === 'preferredList'
                        ? getTotalConnectedAndNotConnectedSites(
                            segment?.preferredSites || [],
                          )
                        : !segment?.patientCount?.feasibility
                        ? 0
                        : segment?.patientCount?.feasibility,
                    )
                  : totalPatientFormatter(segment?.finalCount || 0)
              }
            />
            <DropDown
              items={segmentDropdownItems}
              className={'segments-dropdown-options'}
              onChange={(e) => handleSelectOption(e, index)}
            >
              <Options style={{ cursor: 'pointer' }} />
            </DropDown>
          </div>
        </div>
      ))}
      <div className="segments-add-icon-container">
        <SegementAddIcon
          className="segment-add-icon"
          height={16}
          width={16}
          onClick={handlAddSegment}
        />
      </div>
      <AlertMessageModel
        activeSegment={activeSegment}
        isOpen={open}
        onClose={setOpen}
      />
    </>
  );
};

export default Segments;
