import { dashboardApiUrls } from '../../../../constant/ApiEndPoints';
import ApiUtil from '../../../../utils/ApiUtils';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dataReader } from '../../../../utils/CommonFunction';
import { feasibilityStudy } from '../../../../constant/ConstantTexts';

const useSaveandCloseService = () => {
  const navigate = useNavigate();
  const { segments } = useSelector((state) => state.feasibilityStudyReducer);
  const { projectId, segmentId } = useSelector((state) => state.projectReducer);

  const saveUserProject = () => {
    const study = JSON.parse(JSON.stringify(segments));
    const formatFeasibilityStudy = (val) => {
      const newData = [];
      val.map((ele, index) => {
        newData.push({
          segmentId: segmentId[index],
          name: ele.name,
          isDone: ele.isDone,
          feasibilityStudy: ele.feasibilityStudy,
          location: ele.location,
          selectedCountries: ele.selectedCountries,
          sitesContacted: ele.sitesContacted,
          sitesInitiated: ele.sitesInitiated,
          preferredSites: ele.preferredSites,
          sites: [], //this is for testing purpose only
          finalCount: dataReader([
            ele.feasibilityStudy[ele.feasibilityStudy.length - 1],
          ]),
        });
      });
      return newData;
    };

    const body = {
      caseStudy: formatFeasibilityStudy(study),
    };
    ApiUtil.putData(
      `${dashboardApiUrls.projectUrl}/${projectId}`,
      JSON.stringify(body),
    )
      .then((res) => {
        console.log(res);
        navigate(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createUserProject = (data) => {
    const study = JSON.parse(JSON.stringify(segments));
    const formatFeasibilityStudy = (data) => {
      const newData = [];
      data.map((ele) => {
        newData.push({
          name: ele.name,
          isDone: ele.isDone,
          feasibilityStudy: ele.feasibilityStudy,
          location: ele.location,
          sitesContacted: ele.sitesContacted,
          sitesInitiated: ele.sitesInitiated,
          preferredSites: ele.preferredSites,
          sites: [], //this is for testing purpose only
          finalCount: dataReader([
            ele.feasibilityStudy[ele.feasibilityStudy.length - 1],
          ]),
        });
      });
      return newData;
    };
    const body = {
      ...data,
      caseStudy: formatFeasibilityStudy(study),
    };
    ApiUtil.postData(`${dashboardApiUrls.projectUrl}`, JSON.stringify(body))
      .then((res) => {
        const projectId = res?.data?._id;
        navigate(`/${feasibilityStudy.newFeasibilityStudy}/${projectId}`);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUserProject = (data) => {
    ApiUtil.putData(
      `${dashboardApiUrls.projectUrl}/${projectId}`,
      JSON.stringify(data),
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return {
    saveUserProject,
    createUserProject,
    updateUserProject,
  };
};
export default useSaveandCloseService;
