import { useState, useCallback } from 'react';
import { feasibilityStudyApiUrls } from '../../../../constant/ApiEndPoints';
import ApiUtil from '../../../../utils/ApiUtils';
import { debounce } from '../../../../utils/CommonFunction';

export default function useMedication() {
  const [condition, setCondition] = useState([]);
  const getAllMedicationCondition = async (data) => {
    await ApiUtil.getData(
      `${feasibilityStudyApiUrls.medicationConditionSearchUrl}?value=${data}`,
    )
      .then((res) => {
        const { data } = res.data;
        setCondition(
          data?.map((ele, index) => ({
            value: ele,
            id: index,
          })),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getMedicationCondition = useCallback(
    debounce(getAllMedicationCondition, 300),
    [],
  );
  return {
    condition,
    getMedicationCondition,
  };
}
