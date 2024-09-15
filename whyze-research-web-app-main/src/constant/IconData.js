import React from 'react';

import {
  Alcohol,
  Allergies,
  Availability,
  Bmi,
  Indication,
  Medication,
  Previousstudy,
  Surgery,
  Symptom,
  Weight,
  Nicotine,
  Demographics,
  LocationIcon,
} from '../assets';

export const IconList = [
  {
    Id: 1,
    Title: 'Indication',
    Icons: <Indication />,
  },
  { Id: 2, Title: 'Medication', Icons: <Medication /> },
  {
    Id: 3,
    Title: 'Surgery',
    Icons: <Surgery />,
  },
  {
    Id: 4,

    Title: 'Symptom',
    Icons: <Symptom />,
  },
  {
    Id: 5,
    Title: 'Alcohol',
    Icons: <Alcohol />,
  },
  {
    Id: 6,
    Title: 'Allergies',
    Icons: <Allergies />,
  },
  {
    Id: 7,
    Title: 'BMI',
    Icons: <Bmi />,
  },
  {
    Id: 8,
    Title: 'Nicotine',
    Icons: <Nicotine />,
  },
  {
    Id: 9,
    Title: 'Weight',
    Icons: <Weight />,
  },

  {
    Id: 10,

    Title: 'Availability',
    Icons: <Availability />,
  },
  {
    Id: 11,

    Title: 'Previous study',
    Icons: <Previousstudy />,
  },
  {
    Id: 12,
    Title: 'Demographics',
    Icons: <Demographics />,
  },
  {
    Id: 13,
    Title: 'Location',
    Icons: <LocationIcon />,
  },
];
