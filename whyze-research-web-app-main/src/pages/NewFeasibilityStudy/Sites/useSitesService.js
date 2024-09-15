import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../redux/reducer/authReducer';
import ApiUtil from '../../../utils/ApiUtils';
import { feasibilityStudyApiUrls } from '../../../constant/ApiEndPoints';
import { setSegments } from '../../../redux/reducer/feasibilityStudyReducer';
import store from '../../../redux/store';

const useSitesService = () => {
  const dispatch = useDispatch();
  const { activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );

  const getConnectedSitesPatientCount = async (data) => {
    const { segments } = store.getState().feasibilityStudyReducer;
    const newSegments = JSON.parse(JSON.stringify(segments));
    dispatch(setLoading(true));

    await ApiUtil.postData(
      `${feasibilityStudyApiUrls.sitesWithPatientsCountUrl}`,
      data,
    )
      .then((res) => {
        newSegments[activeSegment.index].totalConnectedNotConnected =
          res.data[0];
        dispatch(setSegments(newSegments));
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(setLoading(false));
  };

  return {
    getConnectedSitesPatientCount,
  };
};

export default useSitesService;
