import { useCallback, useState } from 'react';
import { feasibilityStudyApiUrls } from '../../../../constant/ApiEndPoints';
import ApiUtil from '../../../../utils/ApiUtils';
import { debounce } from '../../../../utils/CommonFunction';

const useAllergiesService = () => {
  const [allergies, setAllergies] = useState([]);
  const [reactions, setReactions] = useState([]);
  const getAllAllergiesList = async (data) => {
    try {
      await ApiUtil.getData(
        `${feasibilityStudyApiUrls.allergiesListSearchUrl}?value=${data}`,
      ).then((res) => {
        setAllergies(
          res.data.result.map((ele, index) => ({
            value: ele.Name,
            id: index,
          })),
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getAllReactionList = async (data) => {
    try {
      await ApiUtil.getData(
        `${feasibilityStudyApiUrls.reactionListSearchUrl}?value=${data}`,
      ).then((res) => {
        setReactions(
          res.data.result.map((ele, index) => ({
            value: ele.ReactionType,
            id: index,
          })),
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  const optimusValue = useCallback(debounce(getAllAllergiesList, 300), []);
  const reactionDebounce = useCallback(debounce(getAllReactionList, 300), []);
  return {
    allergies,
    reactions,
    optimusValue,
    reactionDebounce,
  };
};

export default useAllergiesService;
