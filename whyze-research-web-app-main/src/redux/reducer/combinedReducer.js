import { combineReducers } from 'redux';
import feasibilityStudy from './feasibilityStudyReducer';
import project from './projectsReducer';
import auth from './authReducer';

export default combineReducers({
  feasibilityStudyReducer: feasibilityStudy,
  authReducer: auth,
  projectReducer: project,
});
