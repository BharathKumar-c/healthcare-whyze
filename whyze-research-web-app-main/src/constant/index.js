import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  Link,
  Restricted,
  Apartment,
  Ireland,
  France,
  UnitedKingdom,
} from '../assets';

export const emailValidationRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const conditionOptions = [
  { key: 'and', label: 'And' },
  { key: 'butNot', label: 'But not' },
  { key: 'or', label: 'Or' },
];

export const medicalConditionOptions = [
  { label: 'Recovered', key: 'recovered' },
  { label: 'Diagnosed', key: 'diagnosed' },
  { label: 'Severity (Stage)', key: 'severity' },
];

export const medicationConditionOptions = [
  { label: 'Started', key: 'started' },
  { label: 'Dosage', key: 'dosage' },
];
export const surgeryConditionOptions = [{ label: 'From', key: 'from' }];

export const periodOptions = [
  { label: 'Days', value: 'day' },
  { label: 'Months', value: 'month' },
  { label: 'Years', value: 'year' },
];

export const nicotinePeriodOptions = [
  { label: 'Days', value: 'day', disabled: true },
  { label: 'Months', value: 'month', disabled: true },
  { label: 'Years', value: 'year' },
];

export const severityStageOptions = [
  { label: 'Stage I', value: 'stage 1' },
  { label: 'Stage II', value: 'stage 2' },
  { label: 'Stage III', value: 'stage 3' },
  { label: 'Stage IV', value: 'stage 4' },
];

export const weightRange = [
  { label: 'Kg', value: 'kg' },
  { label: 'Lbs', value: 'lbs' },
];

export const Gender = [
  { id: 1, gender: 'Male' },
  { id: 2, gender: 'Female' },
];

export const cardBorderColors = {
  Indication: '#FFD24D',
  Medication: '#FFD24D',
  Surgery: '#FFD24D',
  Symptom: '#FFD24D',
  Demographics: '#FFD24D',
  Allergies: '#4DE6E6',
  BMI: '#4DE6E6',
  Nicotine: '#4DE6E6',
  Alcohol: '#4DE6E6',
  Weight: '#D9F042',
  Availability: '#D9F042',
  'Previous study': '#D9F042',
};
export const accessPermissionList = [
  { label: 'Restricted', value: 'Restricted' },
  { label: 'CROs Consulting', value: 'CROs Consulting' },
  { label: 'Copy read only view link', value: 'Copy read only view link' },
];
export const PeopleAccess = [
  { label: 'Viewer', value: 'Viewer' },
  { label: 'Editor', value: 'Editor' },
];
export const accessPermissionmessage = [
  {
    icon: <Apartment />,
    key: 1,
    value: 'CROs Consulting',
    message: 'Anyone in this group with the link can edit',
  },
  {
    icon: <Restricted />,
    key: 2,
    value: 'Restricted',
    message: 'Only people with access can edit with the link ',
  },
  {
    icon: <Link />,
    key: 3,
    message: 'Anyone with the link can can access the read-only version.',
    value: 'Copy read only view link',
  },
];
export const countriesList = [
  { id: 1, name: 'Germany', noOfPatients: 10000, isFavourite: false },
  {
    id: 2,
    name: 'United States of America',
    noOfPatients: 90000,
    isFavourite: false,
  },

  { id: 3, name: 'India', noOfPatients: 20000, isFavourite: false },
  { id: 4, name: 'United Kingdom', noOfPatients: 3000, isFavourite: false },
  { id: 5, name: 'Ireland', noOfPatients: 10090, isFavourite: false },
  { id: 6, name: 'Netharland', noOfPatients: 160000, isFavourite: false },
  { id: 7, name: 'China', noOfPatients: 12000, isFavourite: false },
  { id: 8, name: 'Bangladesh', noOfPatients: 3000, isFavourite: false },
  { id: 9, name: 'France', noOfPatients: 3000 },
  { id: 10, name: 'Itally', noOfPatients: 30000 },
];

export const dosageOptions = [
  { label: 'Higher than', value: 'Higher than' },
  { label: 'Lower than', value: 'Lower than' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Low', value: 'Low' },
  { label: 'Exact dosage', value: 'Exact dosage' },
];

export const unitOptions = [
  { label: 'mg', value: 'mg' },
  { label: 'ml', value: 'ml' },
  { label: 'drops', value: 'drops' },
  { label: 'capsule', value: 'capsule' },
  { label: 'puffs', value: 'puffs' },
];

export const countrySelect = [
  {
    label: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
        }}
      >
        <Ireland
          style={{ padding: '0', margin: '7px 0 0 0', height: '17px' }}
        />
        <p>+353</p>
      </div>
    ),
    value: '+353',
  },
  {
    label: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
        }}
      >
        <UnitedKingdom
          style={{ padding: '0', margin: '7px 0px 3px 7px', height: '17px' }}
        />
        <p style={{ bottom: 0, margin: 0 }}>+44</p>
      </div>
    ),
    value: '+44',
  },
  {
    label: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
        }}
      >
        <France
          style={{ padding: '0', margin: '7px 0px 7px 1px', height: '17px' }}
        />
        <p>+33</p>
      </div>
    ),
    value: '+33 ',
  },
];
export const AllergiesOptions = [{ label: 'Reactions', key: 'reactions' }];
export const dummyDataForLoaction = [
  {
    title: 'Africa (9,573)',
    key: '0-0',
    children: [
      {
        title: 'Africa test city - 1',
        key: '0-0-0',
      },
      {
        title: 'Africa test city - 2',
        key: '0-0-1',
      },
      {
        title: 'Africa test city - 3',
        key: '0-0-2',
      },
    ],
  },
  {
    title: 'Asia (52K)',
    key: '0-1',
    children: [
      {
        title: 'Asia test city - 1',
        key: '0-1-0-0',
      },
      {
        title: 'Asia test city - 2',
        key: '0-1-0-1',
      },
      {
        title: 'Asia test city - 3',
        key: '0-1-0-2',
      },
    ],
  },
  {
    title: 'Australia (11K)',
    key: '0-2',
  },
];
export const Allergiesarray = [
  {
    id: '5aab68fc-b0ee-4cb5-b326-1aac30e8d90e',
    value: 'Sesame Seeds',
  },
  {
    id: '5078063a-845a-412f-8383-1d7998504ff2',
    value: 'Other',
  },
  {
    id: '79b502d7-a637-4aa8-9424-231887dfa672',
    value: 'Poison Sumac',
  },
  {
    id: 'b4b3bab9-45b1-4051-82f1-23ae8845065a',
    value: 'Bees',
  },
  {
    id: '620fb885-de0e-4623-85fc-2421443f30e5',
    value: 'Peanuts',
  },
  {
    id: '06453f08-ed83-4d9a-8b90-3455b9efe7bd',
    value: 'Cat',
  },
  {
    id: '972240e0-c0d7-44e3-ab3c-3576a99d138c',
    value: 'Carbamazepine',
  },
  {
    id: '88692ca4-8a69-4e7e-a63b-35c8e6eec1f0',
    value: 'Yellow Jackets',
  },
  {
    id: '0612ed9d-477a-461c-8e5d-3e7471da5c04',
    value: 'Fire Ant',
  },
  {
    id: 'a455eea4-9807-4da5-b70b-3ee36c1c54dd',
    value: 'Phenytoin',
  },
  {
    id: 'edc69e86-d3dd-49a4-b80b-41e2f9bcbbe5',
    value: 'Cockroachers',
  },
  {
    id: '9181f8bf-a109-4d12-875f-47a1db901cf6',
    value: 'Milk',
  },
  {
    id: '2458f041-44d8-486d-b394-4d52d36816a6',
    value: 'Dust',
  },
  {
    id: '3a137907-2f38-4e9b-83ca-4daa838e6686',
    value: 'Dog',
  },
  {
    id: '10bc8f38-d7fe-4030-8c59-549f79851173',
    value: 'Insulin',
  },
  {
    id: '57c05fe2-c074-4d83-80f6-5ae7b9bc8b7c',
    value: 'Lamotrigine',
  },
  {
    id: 'a9ec797a-be78-4e62-bc70-5ce268dddc23',
    value: 'Dust Mites',
  },
  {
    id: '944a557c-3a4d-4040-bd45-60669fd68932',
    value: 'Shellfish',
  },
  {
    id: '52102f30-d330-4140-b3d0-6a62de022e59',
    value: 'Sulfomanides',
  },
  {
    id: '42472aef-86c5-4d1e-843a-6f0e6a064249',
    value: 'Eggs',
  },
  {
    id: '50284d4a-2dc3-40b1-9a0c-7114b8e1cb08',
    value: 'Mosquitoes',
  },
  {
    id: '3de6f469-0976-4de5-b70e-7cb3001ca90e',
    value: 'Bedbugs',
  },
  {
    id: 'ab27c1c4-de25-4202-893e-7d92c6bfa0bd',
    value: 'Poison Oak',
  },
  {
    id: '0d0d73a6-0e61-4a79-82fb-7fa24dcd8400',
    value: 'Hornets',
  },
  {
    id: 'a2e05122-08e4-48f1-9dc6-85eb5e817203',
    value: 'Abacavir',
  },
  {
    id: '6dca4896-a340-40ce-9517-8722e84ae511',
    value: 'Cetuximab',
  },
  {
    id: '78900ebc-4b26-4952-963e-944ca5a7135a',
    value: 'Amoxicillin',
  },
  {
    id: 'a40e12cc-fcd1-4673-9b7c-9b8369e0a15e',
    value: 'Aspirin',
  },
  {
    id: '0e32be16-23d8-4916-ad4d-9edb44417cb5',
    value: 'Ampicillin',
  },
  {
    id: '5e026bea-b634-4871-a2ae-a4d7dca1ba8b',
    value: 'Tetracycline',
  },
  {
    id: '7cb536d4-cc31-4669-8c7d-a79755bb4e0f',
    value: 'Tree Nuts',
  },
  {
    id: 'e5230307-a22a-47c9-a905-b610dbf96d30',
    value: 'Naproxen',
  },
  {
    id: 'c9218533-a666-481e-9434-b71c7b112931',
    value: 'Fleas',
  },
  {
    id: '540f323e-2156-4a67-93ad-b839b2602aa3',
    value: 'Fish',
  },
  {
    id: '53fba8cf-bd49-4c1b-a687-b9c143046377',
    value: 'Penicillin',
  },
  {
    id: '46884d41-88e8-4508-8b5d-c856e84899bb',
    value: 'Soy',
  },
  {
    id: '0eb91bbd-21b6-4731-a2f6-d40aac2c1b44',
    value: 'Anticonvulsants',
  },
  {
    id: 'c070cda3-6221-4339-8764-d4d855f2858b',
    value: 'Ibuprofen',
  },
  {
    id: '51d0de28-2812-4f6e-96fd-d5dc677c4a81',
    value: 'Latex',
  },
  {
    id: '352378af-6969-4f4e-a27c-d88fd033cd8c',
    value: 'Mustard Seeds',
  },
  {
    id: '11129b26-fd0f-469c-8093-dac58ed71bcd',
    value: 'Vecuronium',
  },
  {
    id: 'c87245da-036c-46fc-a995-e1b5c30bc848',
    value: 'Mold',
  },
  {
    id: 'a0c3b0ab-e774-460b-a219-e563652b607c',
    value: 'Wasps',
  },
  {
    id: 'd4e04c21-466d-4046-8c14-e5b49ddaed33',
    value: 'Atracurium',
  },
  {
    id: '7d7d1776-58b7-4d23-ac10-e630f87ae4ea',
    value: 'Wheat',
  },
  {
    id: '49117fc7-5457-4c78-a1ac-ec8c15650f7f',
    value: 'Retuximab',
  },
  {
    id: '8eeeb4e9-4320-46c2-957f-ee9fcda49cf8',
    value: 'Poison Ivy',
  },
  {
    id: 'e83c6f14-75a9-4136-b029-eeef738fe9c8',
    value: 'Nevirapine',
  },
  {
    id: '87d3cf82-dfe7-4265-8eec-f15f5590208a',
    value: 'Kissing Bugs',
  },
  {
    id: '92d0c1a9-08ab-4bfe-9633-f1693436312e',
    value: 'Succinylcholine',
  },
];

export const Symptomarray = [
  {
    id: 'afce5853-49d8-4643-b5b9-09319d6a617f',
    value: 'Red, swollen, watery eyes',
  },
  {
    id: '726f6e42-dcaf-49d8-8948-133aa3b660d1',
    value: 'Sneezing ',
  },
  {
    id: 'ca3b1746-77d0-4cf0-a36b-2cade05a79f5',
    value: 'Rash',
  },
  {
    id: 'def6b8a5-2295-416e-ab11-2e82e83a10e5',
    value: 'Itching or hives (itchy red spots on the skin)',
  },
  {
    id: '4dcc34a9-ebc6-4445-8d55-38932661b106',
    value: 'Difficulty breathing',
  },
  {
    id: 'dba38d43-d18a-4414-8488-3ddc970996af',
    value: 'Weakness',
  },
  {
    id: '929fccf9-618d-43e0-9d36-3f50b8a30626',
    value: 'Flushing of the face',
  },
  {
    id: '2a806789-e6ad-4713-b1a7-45deb0c69e5c',
    value: 'Itchy eyes, nose or roof of mouth',
  },
  {
    id: 'ad73a773-f964-414b-8850-75d7becb2844',
    value: 'Scratchy throat',
  },
  {
    id: '29f659b7-8e0a-4df6-9dfc-78364d1dc6c2',
    value: 'Other',
  },
  {
    id: '990969fb-c083-4c3d-9275-835c6aa58166',
    value: 'Diarrhea',
  },
  {
    id: '235a4d62-af51-4f72-a3f8-8c3d8facae37',
    value: 'Dizziness (vertigo)',
  },
  {
    id: 'cae4186b-a457-4965-8364-a27469a6471f',
    value: 'Swelling of the face, eyes, or tongue',
  },
  {
    id: 'fe4fe3c9-e94e-40fd-85a7-add168202c84',
    value: 'Runny or stuffy nose',
  },
  {
    id: '98394a6b-61a8-4fd9-9bfe-b850afcc262d',
    value: 'Abdominal cramping or pain',
  },
  {
    id: 'cb63efb5-ec7c-4020-901b-b8a52c44a459',
    value: 'Edema',
  },
  {
    id: '6380f857-df4e-4b28-a573-bb5bcd6cf93b',
    value: 'Anaphylaxis',
  },
  {
    id: '10d97ec1-be44-4270-9705-bd51b548ed0e',
    value: 'Heart palpitations',
  },
  {
    id: '54ea2e09-c5a9-45b5-9aca-c4b8b00457fe',
    value: 'Difficulty swallowing',
  },
  {
    id: '6eaecbca-8b4e-43bd-92ac-d4641e1f2327',
    value: 'Nausea or vomiting',
  },
  {
    id: 'a9526e6f-9170-4a35-9a33-dcf727066b3a',
    value: 'Wheezing',
  },
  {
    id: '6b1e388f-2dfd-4e0f-9300-ddb9bcce0703',
    value: 'Fear or anxiety',
  },
  {
    id: '22b4ac41-5284-4d47-82a1-ee7b6a71b2c1',
    value: 'Pain or tightness in the chest',
  },
];
export const nicotineConditionOptions = [
  { label: 'Quit', key: 'quit' },
  { label: 'Started', key: 'started' },
];
export const weightConditionOptions = [{ label: 'Range', key: 'range' }];
export const bmiConditionOptions = [{ label: 'Range', key: 'bmiRange' }];
export const rangeOptions = [
  { label: 'From', value: 'from' },
  { label: 'Between', value: 'between' },
  { label: 'Below', value: 'below' },
];

export const feasibilityStudyConstant = [
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
];

export const preferredTabList = [
  {
    key: 'preferredSites',
    tab: 'Preferred sites',
  },
  {
    key: 'sitesContacted',
    tab: 'Sites contacted',
  },
  {
    key: 'sitesInitiated',
    tab: 'Sites initiated',
  },
];

export const errorConstants = {
  emailMustBeEntered: 'Email address must be entered',
  enterValidEmailAddress: 'Enter valid email address',
  passwordMustBeEntered: 'Password must be entered',
  passwordsDoNotMatch: 'Passwords do not match',
  passwordLength: 'Password must be at least 8 characters',
  passwordMustContainReqCharacters:
    'Password should contain uppercase, lowercase, number and symbol',
  inCorrectEmailPassword: 'Incorrect email or password',
  patientNullError:
    'Oops, we can’t find that country. Either double-check the spelling or search again for another one',
};

export const labelAndTitleConstants = {
  applicationName: 'WHYZE',
  resetPassword: 'Reset password',
  sendResetLink: 'Send Reset Link',
  password: 'Password',
  changePassword: 'Change Password',
  confirmPassword: 'Confirm Password',
  createNewPassword: 'Create a new password',
  chooseStrongPassword: 'Choose a strong password',
  signIn: 'Sign in',
  forgotPassword: 'Forgot your password?',
  clickHere: 'Click here',
  forgotPasswordDescription:
    'Please enter your email address and we will send you a link to reset your password',
  email: 'Email',
  forgotPasswordTryAgain: 'Didn’t receive it ? Please try again',
  backTo: 'Back to',
  LoginText: 'Login',
  resetPasswordTitle: 'Check your email',
  resetPasswordSuccess: 'Your password has been changed successfully.',
};

export const localStorageKey = {
  token: 'token',
  refreshToken: 'refreshToken',
  credentials: 'credentials',
  userDetails: 'userDetails',
};

export const regexConstants = {
  emailRegex: /^([a-zA-Z0-9_.+-/$])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  passwordRegex:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
};

export const autocompleteDefaultLabel = [
  {
    label: <div>Enter 3 or more Characters</div>,
    disabled: true,
  },
];
export const autocompleteEmptyLabel = [
  {
    label: <div>No items found</div>,
    disabled: true,
  },
];

export const bmiRangeOptions = [
  { label: 'Underweight (<18.5)', value: 'underWeight' },
  { label: 'Normal weight (18.5 - 24.9)', value: 'normalWeight' },
  { label: 'Overweight (25 - 29.9)', value: 'overWeight' },
  { label: 'Obesity (>=30)', value: 'obesity' },
];

export const nicotineSearchBoxOption = [
  { label: 'Yes', value: 'yes' },
  { label: 'Not anymore', value: 'notAnyMore' },
  { label: 'No, never', value: 'no' },
];

export const projectSettingMeasurementsOption = ['Metric', 'Imperial'];
