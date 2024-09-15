import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export const initialState = {
  segments: [
    {
      name: 'Segment-1',
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
      feasibilityStudy: [
        {
          name: 'Indication',
          case: 'Indication',
          condition: 'Inclusion',
          caseName: '',
          child: [],
        },
        {
          name: 'Demographics',
          case: 'Demographics',
          condition: 'Inclusion',
          caseName: '',
          child: [
            {
              id: uuid().slice(0, 8),
              condition: 'Gender',
              field: 'gender',
              gender: '',
            },
            {
              id: uuid().slice(0, 8),
              condition: 'Age range',
              field: 'age',
              ageRange: {
                min: 0,
                max: 0,
              },
            },
          ],
        },
      ],
      country: [],
      location: [],
      selectedCountries: [],
      totalConnectedNotConnected: {},
      sites: [],
      sitesContacted: [],
      sitesInitiated: [],
      preferredSites: [],
      patientCount: {
        feasibility: 0,
        location: 0,
      },
      siteCount: {
        feasibility: 0,
        location: 0,
      },
    },
  ],
  cardValue: {
    case: 'Indication',
    condition: '',
    index: 0,
  },
  activeSegment: {
    name: '',
    index: 0,
  },
};

const feasibilityStudySlice = createSlice({
  name: 'feasibilityStudyAction',
  initialState: initialState,
  reducers: {
    setCardDetails: (state, { payload }) => {
      state.cardValue = payload;
    },
    setSegments: (state, { payload }) => {
      state.segments = payload;
    },
    setActiveSegment: (state, { payload }) => {
      state.activeSegment = payload;
    },
    resetSegments: (state) => {
      state.segments = initialState.segments;
      state.cardValue = {
        case: 'Indication',
        condition: '',
        index: 0,
      };
      state.activeSegment = {
        name: '',
        index: 0,
      };
    },
  },
});

export const { setCardDetails, setSegments, setActiveSegment, resetSegments } =
  feasibilityStudySlice.actions;

export default feasibilityStudySlice.reducer;
