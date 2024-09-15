const { Appointments } = require('../models');

const createPatientAppoinment = async appointmentData => {
  const {
    case_id,
    condition,
    end_date,
    hcp,
    hcp_name,
    location,
    patient,
    patient_name,
    start_date,
    appointment_type,
  } = appointmentData;
  try {
    return Appointments.create({
      case_id,
      condition,
      end_date,
      hcp,
      hcp_name,
      location,
      patient,
      patient_name,
      start_date,
      type: appointment_type,
      created_by: hcp,
      updated_by: hcp,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createPatientAppoinment,
};
