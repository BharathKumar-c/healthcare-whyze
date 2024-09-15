import React, { useEffect, useState } from 'react';
import { Text, Button } from '../../components/basic';
import './Dashboard.scss';
import {
  createFirstStudy,
  createFirstStudyContent,
  feasibilityStudiesInPlanning,
  seeAll,
} from '../../constant/ConstantTexts';
import ProjectLayout from './ProjectLayout';
import useDashboard from './useDashboard';
import { useSelector } from 'react-redux';
import SettingModal from '../../components/shared/SettingModal';
import { useDispatch } from 'react-redux';
import { clearSettings } from '../../redux/reducer/projectsReducer';
import { RoutesUrls } from '../../constant/RoutesUrls';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getProjects } = useDashboard();
  const { projects } = useSelector((state) => state.projectReducer);
  const { userDetails, isLoading } = useSelector((state) => state.authReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    getProjects();
  }, []);
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
    dispatch(clearSettings());
  };

  return (
    <div id="dashboard">
      <div className="dashboard">
        {!isLoading && (
          <div className="dashboard-container">
            <Text
              className="dashboard-title"
              text={`Welcome ${userDetails?.name ? userDetails?.name : ''}!`}
            />

            {projects?.length === 0 ? (
              <div className="dashboard-patient-study-container">
                <div className="dashboard-patient-study-text">
                  <div>
                    <Text className="dashboard-title" text={createFirstStudy} />
                  </div>
                  <div>
                    <Text
                      className="dashboard-patient-study-content"
                      text={createFirstStudyContent}
                    />
                  </div>
                </div>
                <div className="dashboard-patient-study-btn">
                  <Button
                    className="dashboard-patient-study-button"
                    label="Let's go"
                    handleButtonClick={() => setOpenModal(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="dashboard-projects-list">
                <div className="dashboard-projects-list-header">
                  <div>
                    <Text
                      className="dashboard-projects-list-title"
                      text={feasibilityStudiesInPlanning}
                    />
                  </div>

                  <div
                    className="dashboard-projects-list-see-all-text"
                    onClick={() =>
                      navigate(`/${RoutesUrls.feasibilityStudiesInPlanning}`)
                    }
                  >
                    {seeAll}
                  </div>
                </div>

                <div className="dashboard-projects-container">
                  {projects?.length !== 0 &&
                    projects?.map((project, index) => (
                      <>
                        {index < 4 && (
                          <div
                            key={project.projectId}
                            className="dashboard-projects-container-content"
                          >
                            <ProjectLayout key={index} project={project} />
                          </div>
                        )}
                      </>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {openModal && (
        <SettingModal
          openModal={openModal}
          handleClose={handleClose}
          type="create"
        />
      )}
    </div>
  );
};

export default Dashboard;
