/* eslint-disable indent */
const { MedicalCondition } = require('../models');
// eslint-disable-next-line no-unused-vars
const { diff } = require('../utils/arrayUtils');
const { dateFormatter, isoDateFormat } = require('../utils/dateUtils');

const getAllMedicalCondition = async patient => {
  const patientMedicalConditionData = await MedicalCondition.find({
    patient,
    is_active: true,
    main_issue: { $exists: false },
  })
    .select('-created_on -updated_on -__v -created_by -updated_by')
    .populate([
      {
        path: 'related_issues',
        model: 'MedicalCondition',
        select: '-created_on -updated_on -__v',
      },
    ]);
  const listOfMedicalCondition = patientMedicalConditionData.map(ele => ({
    patient_condition_id: ele._id,
    patient_id: ele?.patient,
    name: ele?.name,
    icd10_code: ele?.icd10_code,
    status: ele?.status || '',
    is_in_treatment: ele?.is_in_treatment,
    recovery_date: ele?.recovery ? isoDateFormat(ele?.recovery_date) : ' ',
    diagnosis_date: ele?.diagnosis_date
      ? isoDateFormat(ele?.diagnosis_date)
      : '',
    related_issues: ele?.related_issues || [],
    is_active: ele?.is_active,
    is_recovered: ele?.is_recovered,
  }));
  return listOfMedicalCondition;
};

const getMedicalConditionById = async (patientId, conditionId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await MedicalCondition.findOne({
      patientId,
      _id: conditionId,
    })
      .select('-created_on -updated_on -__v -created_by -updated_by')
      .populate([
        {
          path: 'related_issues',
          model: 'MedicalCondition',
          select: '-created_on -updated_on -__v',
        },
      ]);
    const {
      medical_condition_id,
      patient,
      name,
      icd10_code,
      status,
      diagnosis_date,
      main_issue,
      related_issues,
      is_active,
    } = result;
    return {
      medical_condition_id,
      patient,
      name,
      icd10_code,
      status,
      diagnosis_date,
      main_issue,
      related_issues,
      is_active,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// status patient condition patient id relatedissuse patientid
const createMedicalCondition = async (conditionObj, patientId) => {
  try {
    const relatedIssuesList = conditionObj.related_issues || [];

    const recovery_date =
      conditionObj.recovery_month && conditionObj.recovery_year
        ? dateFormatter(
            `01/${conditionObj.recovery_month}/${conditionObj.recovery_year}`,
          )
        : null;

    const diagnosis_date =
      conditionObj.diagnose_month && conditionObj.diagnose_year
        ? dateFormatter(
            `01/${conditionObj.diagnose_month}/${conditionObj.diagnose_year}`,
          )
        : null;

    // eslint-disable-next-line no-param-reassign
    delete conditionObj.related_issues;
    const medicalConditionObj = await MedicalCondition.create({
      ...conditionObj,
      diagnosis_date,
      recovery_date,
      patient: patientId,
      created_by: patientId,
      updated_by: patientId,
    });
    console.log('Medical Condition inserted for ', patientId);
    if (relatedIssuesList.length > 0) {
      const conditionList = await MedicalCondition.insertMany(
        relatedIssuesList.map(obj => ({
          ...obj,
          main_issue: medicalConditionObj.medical_condition_id,
          patient: patientId,
          created_by: patientId,
          updated_by: patientId,
        })),
      );
      const medicalConditionIds = conditionList.map(
        a => a.medical_condition_id,
      );
      console.log('Related issues inserted for ', patientId);
      // eslint-disable-next-line no-param-reassign
      medicalConditionObj.related_issues = medicalConditionIds;
      medicalConditionObj.save();
    }
  } catch (error) {
    console.log('Error in Medical Condition', patientId, '->', error.message);
    throw error;
  }
};

// eslint-disable-next-line max-lines-per-function
const updateMedicalCondition = async (conditionId, conditionObj, patientId) => {
  try {
    const recovery_date =
      conditionObj.recovery_month && conditionObj.recovery_year
        ? dateFormatter(
            `01/${conditionObj.recovery_month}/${conditionObj.recovery_year}`,
          )
        : null;

    const diagnosis_date =
      conditionObj.diagnose_month && conditionObj.diagnose_year
        ? dateFormatter(
            `01/${conditionObj.diagnose_month}/${conditionObj.diagnose_year}`,
          )
        : null;

    const condition = await getMedicalConditionById(patientId, conditionId);
    let newRelatedIssueIdsList = [];
    let oldRelatedIssueIdsList = [];
    const oldRelatedIssueList = condition.related_issues || [];
    const newRelatedIssueList = conditionObj.related_issues || [];

    // eslint-disable-next-line no-param-reassign
    delete conditionObj.related_issues;

    if (oldRelatedIssueList.length > 0) {
      oldRelatedIssueIdsList = oldRelatedIssueList.map(a => a._id.toString());
    }
    if (newRelatedIssueList.length > 0) {
      newRelatedIssueIdsList = newRelatedIssueList.map(a => a._id);
      const exisitngRelatedIssueList = newRelatedIssueList.filter(a => a._id);
      if (exisitngRelatedIssueList.length > 0) {
        exisitngRelatedIssueList.forEach(async issue => {
          await MedicalCondition.updateOne(
            { _id: issue._id },
            { $set: { ...issue, updated_by: patientId } },
            { new: true, runValidators: true },
          );
        });
      }
    }

    await MedicalCondition.updateOne(
      {
        _id: conditionId,
      },
      {
        $set: {
          ...conditionObj,
          updated_by: patientId,
          diagnosis_date,
          recovery_date,
        },
      },
      { new: true, runValidators: true },
    );

    // delete related condition
    const deletedRelatedIssueIdsList = oldRelatedIssueIdsList.diff(
      newRelatedIssueIdsList,
    );

    if (deletedRelatedIssueIdsList.length > 0) {
      deletedRelatedIssueIdsList.forEach(async issueId => {
        console.log('deleting ->', issueId);
        await MedicalCondition.deleteOne({ _id: issueId });
      });
      await MedicalCondition.updateOne(
        { _id: conditionId },
        { $pull: { related_issues: { $in: deletedRelatedIssueIdsList } } },
      );
    }

    // add new related condition
    const newlyAddedRelatedConditionList = newRelatedIssueList.filter(
      a => !a._id,
    );

    if (newlyAddedRelatedConditionList.length > 0) {
      const conditionList = await MedicalCondition.insertMany(
        newlyAddedRelatedConditionList.map(obj => ({
          ...obj,
          main_issue: conditionId,
          patient: patientId,
          created_by: patientId,
          updated_by: patientId,
        })),
      );
      const medicalConditionIds = conditionList.map(
        a => a.medical_condition_id,
      );
      console.log('Related issues inserted for ', patientId);

      await MedicalCondition.updateOne(
        { _id: conditionId },
        { $push: { related_issues: { $each: medicalConditionIds } } },
      );
    }

    console.log(conditionId, conditionObj, patientId);
  } catch (error) {
    console.log('Error in Medical Condition', patientId, '->', error.message);
    throw error;
  }
};

module.exports = {
  createMedicalCondition,
  getAllMedicalCondition,
  getMedicalConditionById,
  updateMedicalCondition,
};
