import React from 'react';

// dashboard welcome Screen const text

export const welComeComponentContent =
  'See how Whyze is preforming for researchers like you.';
export const createFirstStudy = 'Create your first study';
export const createFirstStudyContent =
  'Define your protocol or create your first feasibility study';
export const patientstitleLable = 'Patients';
export const totalPatientsLable = 'Total patients';
export const countriesLable = 'Countries';
export const sitesLable = 'Sites';
export const sitesRecruitedLable = 'Sites recruited';
export const avgTimeLable = 'Avg. response time';
export const trialsLable = 'Trials';
export const activeTrials = 'Active trials';
export const totalTrials = 'Total trials';
export const screenFailRate = 'Screen fail rate';
export const threeMonths = '3 months';
export const avgTimeToRecruit = 'Avg. time to recruit';
export const feasibilityStudiesInPlanning = 'Feasibility studies in planning';
export const seeAll = 'See all';

//Profile Page const text
export const ResearcherTitle = 'Researcher title -';
export const AuthProfile = 'AUTHENTICATED PROFILE';
export const ContactDetails = 'Contact details';
export const CompanyEmail = 'Company email address';
export const PhoneNumber = 'Phone';

//ContactModal Page Const texts

export const EmailAddress = 'Email address';
export const Phone = 'Phone';
export const okButtonLabel = 'Ok';
export const saveButtonLabel = 'save';
export const cancelButtonLabel = 'cancel';
export const contactDetailsLabel = 'Contact details';

//Addcriteria texts
export const addCriteriaTitle = 'Select a criteria item';

//RenameModal texts
export const renameModalTitle = 'Profile details';
export const fullNameLabel = 'Full name';
export const titleLabel = 'Title';

// Medication constant texts
export const medicationConstants = {
  medicationLabel: 'Medication',
  medicationErrorMessage: 'Please add the Medication',
  selectlabel: 'Select Dosage',
  inputLabel: 'Enter value',
  startedPrefixText: 'Started at least',
};
// Indication constant texts
export const indicationConstants = {
  medicalConditionLabel: 'Medical condition',
  medicalConditionErrorMessage: 'Please add the Medical condition',
};

//Allergies constant texte
export const allergiesConstants = {
  allergiesLabel: 'Allergies criteria',
  allergiesPlaceholder: 'Allergies',
  allergiesErrorText: 'Please add the Allergies',
};
//Symptom constant texts

export const symptomConstats = {
  symptomLabel: 'Symptom criteria',
  symptomPlaceholder: 'Symptom',
};
//Project settingmodal Constants

export const projectSettingConstants = {
  addProjectError: 'Please add the project',
  addProjectLabel: 'Project',
  addClientNameError: 'Please add ClientName',
  rangeLabel: 'Select',
  addClientLabel: 'Client name',
  description: 'Description',
  sharingLabel: 'Sharing',
  shareBtnLabel: 'Share',
  standardsText: 'Standards',
  standardDescription: 'Standardising markers and value outputs',
  measurementText: 'Default measurement',
  clinicalTrialError: 'Please add the clinical trial',
  clinicalTrial: 'Clinical Trial',
  sponsorError: 'Please add the sponsor',
  sponsor: 'Sponsor',
  projectSettings: 'Project settings',
  descriptionError: 'Please add the description',
  standardsError: 'Please select the standards',
  noIndication: 'No Indication',
};
export const shareProjectConstants = {
  addPeoplePlaceHolder: 'Add people and groups',
  accessPeopleText: 'People with access',
};
export const selectedPeoplesConstants = {
  addPeople: 'Add people and groups',
  notifyPeopleLabel: 'Notify people',
  messageLabel: 'Message',
};
// Nicotine constant texts
export const nicotineConstants = {
  nicotineConditionErrorMessage: 'Please add the nicotine condition',
  nicotineLabel: 'Nicotine criteria',
};

// Create Account constant texts
export const createAccountContants = {
  createAccounTitle: (
    <>
      Set up your <br /> Whyze account
    </>
  ),
  setUpWhyzeAccount: 'Set up your Whyze account',
  nameLabel: 'Name',
  emailLabel: 'Company email',
  phoneLabel: 'Your phone number',
  passwordLabel: 'Create password',
  characterLengthLabel: 'Between 8 and 20 characters',
  numericLabel: 'At least one number',
  uppercaseLabel: 'At least one upper-case letter',
  lowercaseLabel: 'At least one lower-case letter',
  createAccountButtonLabel: 'Create account',
  agreeConditionText: 'By clicking the button above you agree to our',
  termsOfUseText: 'Terms of use',
  privacyNoticesText: 'Privacy policies',
  alreadyHaveAccountText: 'Already have an account?',
  loginText: 'Login',
  termsOfUseLink: 'https://www.whyzehealth.com/privacy-notice/',
  privacyNoticesLink: 'https://www.whyzehealth.com/terms',
};

//indication const

export const conditions = {
  started: 'started',
  dosage: 'dosage',
  courseOfTherapy: 'course of therapy',
  diagnosed: 'diagnosed',
  recovered: 'recovered',
  severity: 'severity',
};

//demographics const

export const demographicsConst = {
  age: 'age',
  min: 'min',
  max: 'max',
  gender: 'gender',
};

//sites const

export const siteConst = {
  siteInformationCosnt: {
    patientSegmentHeader: 'Patient segment',
    connectedWithSite: 'Connected with this site',
    additionalCatchmentAreas:
      'Additional Whyze patients in site catchment areas',
    sitePerformance: 'Site performance',
    recruitmentTimeline: 'Recruitment timeline',
    dropOutRate: 'Drop out rate',
    trackRecordOfDoingTrials: 'Track record of doing trials',
    completedInThePastyear: 'Completed in the past year',
    primaryInvestigator: 'Primary Investigator',
    administration: 'Administration',
    screenFailRate: 'Screen fail rate',
    industryAverage: 'Industry average',
    avgResponseTime: 'Avg. response time',
  },
};

//setupAccount const

export const setupAccountConst = {
  dontHaveaccount: 'Don’t have an account yet?',
  setUpAccount: 'Set up account',
};

//forgotpassword const

export const forgotpasswordConst = {
  WHYZE: 'WHYZE',
  forgotPassword: 'Forgot Password',
  resendEmail: 'Enter your email below and we will send you a reset email.',
  pleaseTry: 'Didn’t receive it ? Please try again',
  returnTo: 'return to',
  loginPage: 'login',
};

//weight const  texts

export const weightConst = {
  weightRange: 'Weight Range',
  weightMin: 'min',
  weightMax: 'max',
  weightType: 'number',
  weightmaxErrorText: 'add max weight',
  weightminErrorText: 'add min weight',
  weightFrom: 'From',
  weightTo: 'To',
};

export const SaveAndCloseModalConst = {
  SaveAndCloseModalTitle: 'Name before exiting',
  projectNameInputLabel: 'Project',
  projectNameInputPlaceholder: 'New patient segment',
  clientNameInputLabel: 'Client name',
  descriptionNameInputLabel: 'Description',
  patientSegmentInputLabel: 'Patient segment required',
};

// Proposed Site list constant texts

export const proposedSiteListConstants = {
  title: 'Proposed Site List',
  seeMore: 'See more',
  emptyContent:
    'To create your proposed list, drag & drop or add your selected sites here.',
};

// Surgery constant text
export const surgeryConstants = {
  surgeryInputLabel: 'Surgery criteria',
  surgeryInputErrorMessage: 'Please add the Surgery',
};

export const feasibilityStudy = {
  newFeasibilityStudy: 'new-feasibility-study',
};
