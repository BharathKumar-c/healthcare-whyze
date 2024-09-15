import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Sites, Star, StarFilled, UserAdd } from '../../../assets';
import { Avatar, Text } from '../../../components/basic';
import './ProjectLayout.scss';
import {
  feasibilityStudy,
  projectSettingConstants,
} from '../../../constant/ConstantTexts';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../useDashboard';
import { getDateDifference } from '../../../utils/calculations';
import { useSelector } from 'react-redux';

export default function ProjectLayout({ project }) {
  const navigate = useNavigate();
  const { favouriteProjectUpdate } = useDashboard();
  const { userDetails } = useSelector((state) => state.authReducer);

  const { clinicalTrial, isFavourite, segments, projectId, updatedAt } =
    project;

  const [star, setStar] = useState(isFavourite || false);

  const handlefavourite = (value) => {
    setStar(value);
    favouriteProjectUpdate(projectId, value);
  };

  return (
    <div className="project-layout">
      <div className="project-layout-header">
        <Text className="project-layout-title" text={clinicalTrial} />
        <div className="project-layout-header-right">
          <Text
            className="project-layout-created-text"
            text={`${getDateDifference(updatedAt)}`}
          />
          <div
            className="project-layout-favourite"
            onClick={() => handlefavourite(!star)}
          >
            {isFavourite ? <StarFilled /> : <Star />}
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          navigate(`/${feasibilityStudy.newFeasibilityStudy}/${projectId}`);
        }}
      >
        <Text
          className="project-layout-indication-title"
          text={
            segments[0]?.feasibilityStudy[0]?.caseName ||
            projectSettingConstants.noIndication
          }
        />
      </div>
      <div className="project-layout-patient-site-container">
        <div className="project-layout-patient-site-container-alignment">
          <div className="project-layout-patient-site-container-icon">
            <UserAdd />
          </div>
          <Text
            className="project-layout-patient-site-text"
            text={segments[0]?.finalCount}
          />
        </div>
        <div className="project-layout-patient-site-container-alignment">
          <div className="project-layout-patient-site-container-icon">
            <Sites />
          </div>
          <Text className="project-layout-patient-site-text" text="6" />
        </div>
      </div>
      <div className="project-layout-users">
        <div className="project-layout-users-container">
          <Avatar user={userDetails} />
        </div>
      </div>
    </div>
  );
}

ProjectLayout.propTypes = {
  project: PropTypes.objectOf(
    PropTypes.shape({
      clientName: PropTypes.string,
    }),
  ),
  currentIndex: PropTypes.number,
};

ProjectLayout.defaultProps = {
  project: {
    clientName: '',
  },
  currentIndex: 0,
};
