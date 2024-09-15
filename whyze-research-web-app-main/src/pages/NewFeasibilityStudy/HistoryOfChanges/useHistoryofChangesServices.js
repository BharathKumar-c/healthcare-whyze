import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { feasibilityStudyApiUrls } from '../../../constant/ApiEndPoints';
import ApiUtil from '../../../utils/ApiUtils';
import { debounce } from '../../../utils/CommonFunction';
import { setLoading } from '../../../redux/reducer/authReducer';

const useHistoryofChangesServices = () => {
  const [allcount, setAllCount] = useState(0);
  const dispatch = useDispatch();

  const countallValues = () => {
    ApiUtil.getData(`${feasibilityStudyApiUrls.initialPopulation}`)
      .then((res) => {
        setAllCount(res?.data?.count);
        dispatch(setLoading(false));
      })
      .catch((err) => {
        dispatch(setLoading(false));
        console.log(err);
      });
  };
  const optimusValue = useCallback(debounce(countallValues, 300), []);
  return {
    allcount,
    optimusValue,
  };
};

export default useHistoryofChangesServices;
