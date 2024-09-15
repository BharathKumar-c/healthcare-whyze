import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  projectId: '',
  clinicalTrial: '',
  sponsor: '',
  description: '',
  measurement: 'Metric',
  standards: '',
  segmentId: [],
};

const projectSlice = createSlice({
  name: 'projectAction',
  initialState: initialState,
  reducers: {
    setProjects: (state, { payload }) => {
      state.projects = payload;
    },
    setProjectId: (state, { payload }) => {
      state.projectId = payload;
    },
    setClinicalTrial: (state, { payload }) => {
      state.clinicalTrial = payload;
    },
    setSponsor: (state, { payload }) => {
      state.sponsor = payload;
    },
    setDescription: (state, { payload }) => {
      state.description = payload;
    },
    setStandards: (state, { payload }) => {
      state.standards = payload;
    },
    setMeasurement: (state, { payload }) => {
      state.measurement = payload;
    },
    setSegmentId: (state, { payload }) => {
      state.segmentId = payload;
    },
    setProjectSettings: (state, { payload }) => {
      state.projectId = payload.projectId;
      state.segmentId = payload.segmentId;
      state.clinicalTrial = payload.clinicalTrial;
      state.sponsor = payload.sponsor;
      state.description = payload.description;
      state.measurement = payload.measurement;
      state.standards = payload.standards;
    },
    clearSettings: (state) => {
      state.clinicalTrial = '';
      state.sponsor = '';
      state.description = '';
      state.measurement = 'Metric';
      state.standards = '';
      state.projectId = '';
      state.segmentId = [];
    },
  },
});

export const {
  setProjects,
  setProjectId,
  setProjectSettings,
  setClinicalTrial,
  setDescription,
  setSponsor,
  setMeasurement,
  setStandards,
  setSegmentId,
  clearSettings,
} = projectSlice.actions;

export default projectSlice.reducer;
