import { useCallback, useState } from 'react';
import { feasibilityStudyApiUrls } from '../../../../constant/ApiEndPoints';
import ApiUtil from '../../../../utils/ApiUtils';
import { debounce } from '../../../../utils/CommonFunction';

export default function useIndication() {
  const [condition, setCondition] = useState([]);

  const getAllMedicationCondition = async (data) => {
    try {
      await ApiUtil.getData(
        `${feasibilityStudyApiUrls.medicalConditionSearchUrl}?value=${data}`,
      ).then((res) => {
        const { data } = res.data;
        setCondition(
          data?.elements.map((ele, index) => ({
            value: ele?.name,
            id: index,
          })),
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getMedicalCondition = useCallback(
    debounce(getAllMedicationCondition, 300),
    [],
  );
  return {
    condition,
    getMedicalCondition,
  };
}
