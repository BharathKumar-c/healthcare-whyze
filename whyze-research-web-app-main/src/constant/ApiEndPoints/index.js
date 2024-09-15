const FEASIBILITY_API = process.env.REACT_APP_FEASIBILITY_STUDY_BASE_URL;
const AUTH_API = process.env.REACT_APP_AUTH_URL;

export const feasibilityStudyApiUrls = {
  medicalConditionSearchUrl: `${FEASIBILITY_API}/search/indication`,
  medicationConditionSearchUrl: `${FEASIBILITY_API}/search/medication`,
  caseStudyUrl: `${FEASIBILITY_API}/case`,
  locationUrl: `${FEASIBILITY_API}/case/location`,
  initialPopulation: `${FEASIBILITY_API}/case/get-count`,
  allergiesListSearchUrl: `${FEASIBILITY_API}/search/allergies`,
  reactionListSearchUrl: `${FEASIBILITY_API}/search/reaction`,
  sitesDataUrl: `${FEASIBILITY_API}/case/site`,
  sitesWithPatientsCountUrl: `${FEASIBILITY_API}/case/site-patient-count`,
};

export const authEndPoints = {
  login: `${AUTH_API}/login`,
  register: `${AUTH_API}/register`,
  refreshToken: `${AUTH_API}/refreshToken`,
  forgotPassword: `${AUTH_API}/sendResetPasswordLink`,
  resetPassword: `${AUTH_API}/resetPassword`,
};

export const dashboardApiUrls = {
  projectUrl: `${FEASIBILITY_API}/project`,
  favouriteUrl: `${FEASIBILITY_API}/project/favourite`,
};

export const profileApiUrls = {
  image: `${AUTH_API}/image`,
  user: `${AUTH_API}/user`,
  profilePicture: `${AUTH_API}/profilePicture`,
};
