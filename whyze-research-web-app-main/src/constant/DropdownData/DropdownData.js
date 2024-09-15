import React from 'react';
import {
  Delete,
  ChangeTo,
  Rename,
  Duplicate,
  Copy,
  Tick,
  FolderIcon,
  RightArrow,
} from '../../assets';
import './DropdownData.scss';

export const items = [
  { icon: <Rename />, label: 'Rename', key: 'Rename' },
  { icon: <Delete />, label: 'Delete', key: 'Delete' },
  { icon: <Duplicate />, label: 'Duplicate', key: 'Duplicate' },
  { icon: <ChangeTo />, label: 'ChangeTo', key: 'ChangeTo' },
];

export const segmentDropdownItems = [
  {
    label: (
      <div className="segment-dropdown-label">
        <Rename />
        Rename
      </div>
    ),
    key: 'rename',
  },
  {
    label: (
      <div className="segment-dropdown-label">
        <Copy />
        Make a copy
      </div>
    ),
    key: 'makeACopy',
  },
  {
    label: (
      <div className="segment-dropdown-label">
        <Tick />
        Mark as final
      </div>
    ),
    key: 'markAsFinal',
  },
  {
    label: (
      <div className="segment-dropdown-label">
        <FolderIcon />
        Export CSV
      </div>
    ),
    key: 'exportCsv',
  },
  {
    label: (
      <div className="segment-dropdown-label">
        <Delete />
        Delete
      </div>
    ),
    key: 'delete',
  },
  { type: 'divider' },
  {
    label: (
      <div className="segment-dropdown-label-justify-right">
        Copy to new project
        <RightArrow />
      </div>
    ),
    key: 'copyToNewProject',
  },
  {
    label: (
      <div className="segment-dropdown-label-justify-right">
        Save as template
        <RightArrow />
      </div>
    ),
    key: 'saveAsTemplate',
  },
  {
    label: (
      <div className="segment-dropdown-label-justify-right">
        Copy link
        <RightArrow />
      </div>
    ),
    key: 'copyLink',
  },
  { type: 'divider' },
  {
    label: (
      <div className="segment-dropdown-label-justify-right">Move right</div>
    ),
    key: 'moveRight',
    disabled: true,
  },
  {
    label: (
      <div className="segment-dropdown-label-justify-right">Move left</div>
    ),
    key: 'moveLeft',
    disabled: true,
  },
];

export const sitesFilterOptions = [
  { label: 'Highest patient number', key: 'highestPatientNumber' },
  { label: 'Highest site performance', key: 'highestSitePerformance' },
  { label: 'Lowest screen fail rate', key: 'lowestScreenFailRate' },
  { label: 'Alphabetical order', key: 'alphabeticalOrder' },
];

export const feasibilityStudiesFilterOptions = [
  { label: 'Newest', key: 'newest' },
  { label: 'Oldest', key: 'oldest' },
  { label: 'A - Z', key: 'atoz' },
  { label: 'Z - A', key: 'ztoa' },
];
