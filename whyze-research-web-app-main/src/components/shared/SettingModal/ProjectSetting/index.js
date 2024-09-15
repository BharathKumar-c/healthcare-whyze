import React from 'react';
import PropTypes from 'prop-types';
import { Input, Segaments, Select, Text, TextArea } from '../../../basic';
import { projectSettingMeasurementsOption } from '../../../../constant';
import { projectSettingConstants } from '../../../../constant/ConstantTexts';
import {
  setClinicalTrial,
  setSponsor,
  setDescription,
  setStandards,
  setMeasurement,
} from '../../../../redux/reducer/projectsReducer';
import { useDispatch } from 'react-redux';

export default function ProjectSetting(props) {
  const { data, errors } = props;
  const dispatch = useDispatch();

  return (
    <div>
      <Input
        className="mb"
        lable={projectSettingConstants.clinicalTrial}
        errorText={projectSettingConstants.clinicalTrialError}
        value={data.clinicalTrial}
        handleInputChange={(e) => dispatch(setClinicalTrial(e.target.value))}
        isError={errors.clinicalTrial}
      />
      <Input
        className="mb"
        lable={projectSettingConstants.sponsor}
        errorText={projectSettingConstants.sponsorError}
        value={data.sponsor}
        handleInputChange={(e) => dispatch(setSponsor(e.target.value))}
        isError={errors.sponsor}
      />
      <TextArea
        className="mb"
        lable={projectSettingConstants.description}
        errorText={projectSettingConstants.descriptionError}
        value={data.description}
        maxLength={1000}
        handleInputChange={(e) => dispatch(setDescription(e.target.value))}
        isError={errors.description}
      />
      <div style={{ display: 'flex' }}>
        <Text className="label" text={projectSettingConstants.standardsText} />
        <Text
          className="sub-label"
          text={projectSettingConstants.standardDescription}
        />
      </div>
      <div id="project-setting-select">
        <Select
          className="mb"
          placeholder={projectSettingConstants.rangeLabel}
          options={[]}
          name="range"
          value={data.standards}
          handleSelect={(e) => dispatch(setStandards(e))}
          isError={errors.standards}
          errorText={projectSettingConstants.standardsError}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text
          className="label"
          text={projectSettingConstants.measurementText}
        />
      </div>
      <Segaments
        options={projectSettingMeasurementsOption}
        size={'large'}
        value={data.measurement}
        onChange={(e) => dispatch(setMeasurement(e))}
      />
    </div>
  );
}

ProjectSetting.propTypes = {
  data: PropTypes.object,
  errors: PropTypes.object,
};

ProjectSetting.defalutProps = {
  data: {},
  errors: {},
};
