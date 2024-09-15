import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../redux/reducer/authReducer';
import ApiUtil from '../../../utils/ApiUtils';
import { feasibilityStudyApiUrls } from '../../../constant/ApiEndPoints';
import { setSegments } from '../../../redux/reducer/feasibilityStudyReducer';

const useLocationService = () => {
  const dispatch = useDispatch();
  const { segments, activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const newSegments = JSON.parse(JSON.stringify(segments));
  const getSitesList = async (data) => {
    dispatch(setLoading(true));

    await ApiUtil.postData(`${feasibilityStudyApiUrls.sitesDataUrl}`, data)
      .then((res) => {
        newSegments[activeSegment.index].sites = res?.data || [];

        newSegments[activeSegment.index].siteCount = {
          ...newSegments[activeSegment.index].siteCount,
          location: res?.data?.length || 0,
        };
        newSegments[activeSegment.index].patientCount = {
          ...newSegments[activeSegment.index].patientCount,
          location: newSegments[activeSegment.index].selectedCountries.reduce(
            (sum, { count }) => sum + count,
            0,
          ),
        };
        dispatch(setSegments(newSegments));
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(setLoading(false));
  };

  return {
    getSitesList,
  };
};

export default useLocationService;
