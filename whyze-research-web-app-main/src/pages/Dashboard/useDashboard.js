import { useDispatch } from 'react-redux';
import ApiUtil from '../../utils/ApiUtils';
import { dashboardApiUrls } from '../../constant/ApiEndPoints';
import {
  setProjectSettings,
  setProjects,
} from '../../redux/reducer/projectsReducer';
import { setLoading } from '../../redux/reducer/authReducer';
import useNewFeasibilityStudyService from '../NewFeasibilityStudy/useNewFeasibilityStudyService';
import { setSegments } from '../../redux/reducer/feasibilityStudyReducer';

const useDashboard = () => {
  const dispatch = useDispatch();
  const { optimusValue } = useNewFeasibilityStudyService();

  const getProjects = async () => {
    try {
      dispatch(setLoading(true));
      await ApiUtil.getData(`${dashboardApiUrls.projectUrl}`).then((res) => {
        dispatch(setProjects(res?.data?.data));
        dispatch(setLoading(false));
      });
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };
  const getProjectById = async (id) => {
    try {
      let updatedArray;
      dispatch(setLoading(true));
      await ApiUtil.getData(`${dashboardApiUrls.projectUrl}/${id}`)
        .then((res) => {
          updatedArray = res.data.data.segments.map((obj) => ({
            ...obj,
            segmentId: obj.segmentId,
            activeTab: {
              name: 'feasibility',
              index: 0,
            },
            tabs: [
              {
                name: 'feasibility',
                title: 'Feasibility',
                isActive: true,
                position: 'left',
              },
            ],
          }));
          const segmentIds = [];
          updatedArray.map((val) => {
            segmentIds.push(val.segmentId);
          });
          const projectSetting = {
            projectId: res.data.data._id,
            segmentId: segmentIds,
            clinicalTrial: res.data.data.clinicalTrial,
            sponsor: res.data.data.sponsor,
            description: res.data.data.description,
            measurement: res.data.data.measurement,
            standards: res.data.data.standards,
          };
          dispatch(setSegments(updatedArray));
          dispatch(setLoading(false));
          dispatch(setProjectSettings(projectSetting));
        })
        .then(() => {
          optimusValue({
            data: updatedArray[0]?.feasibilityStudy,
          });
        });
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  const favouriteProjectUpdate = async (projectId, value) => {
    dispatch(setLoading(true));
    try {
      await ApiUtil.patchData(`${dashboardApiUrls.favouriteUrl}/${projectId}`, {
        isFavourite: value,
      })
        .then(() => {
          getProjects();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoading(false));
  };
  return { getProjects, getProjectById, favouriteProjectUpdate };
};

export default useDashboard;
