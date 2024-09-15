import React, { useEffect, useState } from 'react';
import './allFeasibilityStudies.scss';
import { useSelector } from 'react-redux';
import ProjectLayout from '../ProjectLayout';
import useDashboard from '../useDashboard';
import { DropDown, Input } from '../../../components/basic';
import { SearchOutlined } from '@ant-design/icons';
import { Dropdown } from '../../../assets';
import { feasibilityStudiesFilterOptions } from '../../../constant/DropdownData/DropdownData';

const FeasibilityStudiesInPlanning = () => {
  const [dropdownFilterBy, setDropdownFilterBy] = useState(
    feasibilityStudiesFilterOptions[0].key,
  );
  const [searchValue, setSearchValue] = useState('');
  const { getProjects } = useDashboard();
  const { projects } = useSelector((state) => state.projectReducer);
  const [filteredProjectData, setFilteredProjectData] = useState(projects);
  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const sortedProjects = sortProjects(
        projects,
        dropdownFilterBy,
        searchValue,
      );
      setFilteredProjectData(sortedProjects);
    }
  }, [projects, dropdownFilterBy, searchValue]);

  const sortProjects = (projects, sortBy, searchValue) => {
    let sortedProjects = [];
    switch (sortBy) {
      case 'newest':
        sortedProjects = [...projects].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
        break;
      case 'oldest':
        sortedProjects = [...projects].sort(
          (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        );
        break;
      case 'atoz':
        sortedProjects = [...projects].sort((a, b) =>
          a.clinicalTrial.localeCompare(b.clinicalTrial),
        );
        break;
      case 'ztoa':
        sortedProjects = [...projects].sort((a, b) =>
          b.clinicalTrial.localeCompare(a.clinicalTrial),
        );
        break;
      default:
        sortedProjects = [...projects].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
    }
    if (searchValue.trim() !== '') {
      sortedProjects = sortedProjects.filter((project) =>
        project.clinicalTrial.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
    return sortedProjects;
  };
  return (
    <div className="feasibility-studies">
      <div className="feasibility-studies-input-container">
        <div className="feasibility-studies-input-container-inputbox">
          <Input
            className="feasibility-studies-title-input"
            prefix={<SearchOutlined />}
            suffix={<Dropdown />}
            placeholder={'Search by name...'}
            handleInputChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div>
          <DropDown
            items={feasibilityStudiesFilterOptions}
            onChange={(value) => {
              setDropdownFilterBy(value.key);
            }}
          >
            <div className="feasibility-studies-dropdown-filter-button">
              <div>
                {
                  feasibilityStudiesFilterOptions.find(
                    (option) => option.key === dropdownFilterBy,
                  ).label
                }
              </div>
              <div>
                <Dropdown />
              </div>
            </div>
          </DropDown>
        </div>
      </div>
      <div className="feasibility-studies-projects-container">
        {filteredProjectData?.length !== 0 &&
          filteredProjectData?.map((project, index) => (
            <div
              key={project.projectId}
              className="feasibility-studies-projects-container-content"
            >
              <ProjectLayout key={index} project={project} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default FeasibilityStudiesInPlanning;
