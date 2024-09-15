import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from '../../utils/CommonFunction';
import ApiUtil from '../../utils/ApiUtils';
import { setLoading } from '../../redux/reducer/authReducer';
import { setSegments } from '../../redux/reducer/feasibilityStudyReducer';
import { feasibilityStudyApiUrls } from '../../constant/ApiEndPoints';
import store from '../../redux/store';

const useNewFeasibilityStudyService = () => {
  const dispatch = useDispatch();
  const [isDisableInput, setIsDisableInput] = useState(false);
  let isVariable = false;
  const deleteCountVariables = (data) => {
    const { array, id, name } = data;
    array?.forEach((obj) => {
      if ((obj.id && obj.id === id) || (obj.name && obj.name === name)) {
        isVariable = true;
      }
      if (isVariable && Object.prototype.hasOwnProperty.call(obj, 'count')) {
        delete obj.count;
      }
      if (obj.child) {
        deleteCountVariables({ array: obj.child, id, name });
      }
    });
  };
  const getCount = async (details) => {
    const { segments, activeSegment } =
      store.getState().feasibilityStudyReducer;
    const { data, id, name } = details;
    const study = JSON.parse(JSON.stringify(segments));
    const newData = JSON.parse(JSON.stringify(data));
    deleteCountVariables({ array: newData, id, name });
    isVariable = false;
    dispatch(setLoading(true));
    setIsDisableInput(true);
    await ApiUtil.postData(`${feasibilityStudyApiUrls.caseStudyUrl}`, newData)
      .then((res) => {
        study[activeSegment.index].feasibilityStudy =
          res?.data?.data?.caseStudy;
      })
      .catch((err) => {
        dispatch(setLoading(false));
        console.log(err);
      });

    await ApiUtil.postData(`${feasibilityStudyApiUrls.locationUrl}`, newData)
      .then((res) => {
        const location = res?.data?.data?.location || [];
        const siteCount = res?.data?.data?.siteCount || 0;

        const country = location?.map((ele) => ({
          country: ele.name,
          count: ele?.count,
        }));

        study[activeSegment.index].location = location;
        study[activeSegment.index].country = country;
        study[activeSegment.index].siteCount = {
          ...study[activeSegment.index]?.siteCount,
          feasibility: siteCount,
        };

        study[activeSegment.index].patientCount = {
          ...study[activeSegment.index].patientCount,
          feasibility: country?.reduce((sum, { count }) => sum + count, 0),
        };
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch(setSegments(study));
    dispatch(setLoading(false));
    setIsDisableInput(false);
  };
  const optimusValue = useCallback(debounce(getCount, 600), []);
  return { getCount, optimusValue, isDisableInput };
};

export default useNewFeasibilityStudyService;
