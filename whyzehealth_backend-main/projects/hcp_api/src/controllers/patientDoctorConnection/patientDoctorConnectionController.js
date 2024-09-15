const { success } = require('../../appConstants/displayConstant');
const { patientDoctorConnectionService } = require('../../services');
const { getPatientByUserId } = require('../../services/patientService');
const { joinTextWithUnderscore } = require('../../utils/commonFunctions');

const formTenantDoctorObj = (data, type) => {
  const tenantDoctorObj = {
    tenantDetails: {
      hcp_id: data?.hcp_id,
      is_connected: data?.is_connected,
      name: data?.clinic_name,
      unique_name:
        data?.clinic_name && joinTextWithUnderscore(data.clinic_name),
      address_line1: data?.address_line1,
      address_line2: data?.address_line2,
      address_line3: data?.address_line3,
      city: data?.city,
      post_code: data?.post_code,
      country: data?.country,
      is_system_added: false,
    },
    userDetails: {
      first_name: data?.first_name,
      last_name: data?.last_name,
      role: 'hcp',
      is_system_added: false,
    },
  };

  if (type === 'update') {
    tenantDoctorObj.tenantDetails.id = data?.tenant_id;
    tenantDoctorObj.userDetails.id = data?.doctor_id;
  }

  return tenantDoctorObj;
};

const getAllConnectedDoctors = async (req, res) => {
  try {
    const result = await patientDoctorConnectionService.getAllConnectedDoctors(
      req.userProfile.patientId,
    );
    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getConnectedDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result =
      await patientDoctorConnectionService.getConnectedDoctorDataById(
        id,
        req.userProfile.patientId,
      );
    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const mapPatientDoctor = async (req, res) => {
  try {
    const { body } = req;

    const tenantDoctorObj = formTenantDoctorObj(body, 'mapping');

    await patientDoctorConnectionService.mapPatientDoctor(
      tenantDoctorObj,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: success });
  } catch (error) {
    return res.status(400).send({ message: error?.message || '' });
  }
};

const updatePatientDoctor = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const tenantDoctorObj = formTenantDoctorObj(body, 'update');

    await patientDoctorConnectionService.updatePatientDoctor({
      tenantDoctorObj,
      user_id: req.userProfile.userId,
      patient_id: req.userProfile.patientId,
      patient_doctor_mapper_id: id,
    });
    return res.status(200).send({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const createOrUpdateDoctorConnection = async (req, res) => {
  try {
    const { body } = req;
    const user_id = req.userProfile.userId;

    const patient = await getPatientByUserId(user_id);

    const doctorObj = {
      patient: patient._id,
      hcp: body?.hcp_id,
      is_connected: body?.is_connected,
    };

    await patientDoctorConnectionService.createOrUpdateDoctorConnection(
      doctorObj,
      user_id,
    );

    return res.status(200).send({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  getAllConnectedDoctors,
  getConnectedDoctorById,
  mapPatientDoctor,
  createOrUpdateDoctorConnection,
  updatePatientDoctor,
};
