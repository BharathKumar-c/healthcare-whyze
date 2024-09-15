const axios = require('axios');
const { s3_medication } = require('../config/AWS');
const {
  getBufferAndFormatFromBase64File,
  saveInS3Bucket,
  deleteObjInS3,
  getSignedUrl,
} = require('./s3Service');
const { PatientMedication } = require('../models');

const getAllPatientMedication = async patientId => {
  const data = await PatientMedication.find({
    patient: patientId,
    is_active: true,
  });

  const result = await Promise.all(
    data.map(async val => {
      let img_file;
      if (val.image_file) {
        img_file = await getSignedUrl(val.image_file);
      }
      return {
        id: val._id,
        name: val.name,
        dosage: val.dosage,
        dosage_unit: val.dosage_unit,
        frequency: val.frequency,
        frequency_unit: val.frequency_unit,
        reason_for_taking: val.reason_for_taking,
        conditions: val.conditions,
        is_active: val.is_active,
        image_file: img_file || '',
      };
    }),
  );

  return result;
};

const getPatientMedication = async (medicationId, patientId) => {
  const data = await PatientMedication.findOne({
    _id: medicationId,
    patient: patientId,
    is_active: true,
  });
  const result = {
    patient_medication_id: data.id,
    name: data.name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    frequency_unit: data.frequency_unit,
    reason_for_taking: data.reason_for_taking,
    conditions: data.conditions,
    is_active: data.is_active,
    image_file: await getSignedUrl(data.image_file),
  };
  return result;
};

const createPatientMedication = async (medicationObj, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const createdData = await PatientMedication.create({
      ...medicationObj,
      patient: userId,
      created_by: userId,
      updated_by: userId,
    });
    if (medicationObj.image_file) {
      const { format, buff } = getBufferAndFormatFromBase64File(
        medicationObj?.image_file,
      );
      const keyName = `${s3_medication}/${createdData._id}`;
      await saveInS3Bucket(format, buff, keyName);
      await PatientMedication.updateOne(
        { _id: createdData._id },
        {
          image_file: keyName,
        },
      );
    }
  } catch (error) {
    throw error;
  }
};

const updatePatientMedication = async (
  medicationObj,
  patientMedicationId,
  userId,
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let key;
    if (medicationObj.image_file) {
      const keyName = `${s3_medication}/${patientMedicationId}`;
      await deleteObjInS3(keyName);
      const { format, buff } = getBufferAndFormatFromBase64File(
        medicationObj.image_file,
      );
      key = `${s3_medication}/${patientMedicationId}`;
      await saveInS3Bucket(format, buff, key);
    }

    return PatientMedication.updateOne(
      { _id: patientMedicationId },
      {
        $set: {
          ...medicationObj,
          image_file: key,
          updated_by: userId,
        },
      },
      { new: true, runValidators: true },
    );
  } catch (error) {
    throw error;
  }
};

const deletePatientMedication = async (patientMedicationId, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const keyName = `${s3_medication}/${userId}`;
    await deleteObjInS3(keyName);
    return PatientMedication.deleteOne({ _id: patientMedicationId });
  } catch (error) {
    throw error;
  }
};
const getMedicationList = async name => {
  const searchUri = `${process.env.GET_MEDICATION_URL}?name=${name}`;
  const headers = {
    Accept: 'application/json',
  };
  try {
    const result = await axios.get(searchUri, {
      headers,
    });
    if (result.status === 200) {
      return result.data;
    }
  } catch (error) {
    console.log(
      '<------------------------getMedicationList--------------------->',
    );
    console.log(error);
    throw error;
  }
};
module.exports = {
  createPatientMedication,
  updatePatientMedication,
  getAllPatientMedication,
  getPatientMedication,
  deletePatientMedication,
  getMedicationList,
};
