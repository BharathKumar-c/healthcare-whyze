const { masterService, patientService } = require('../../services');

const getHIMaster = async (req, res) => {
  try {
    const result = await masterService.getHIMasterData({});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getHIPlanMaster = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await masterService.getHIMasterPlanData({
      health_insurance_master_id: id,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getMyHI = async (req, res) => {
  try {
    const result = await patientService.getMyHIData(req.userProfile.userId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const createPatientHI = async (req, res) => {
  try {
    const {
      health_insurance_id,
      health_insurance_plan_id,
      policy_number,
      pps_number,
      gms_number,
      has_medical_card,
      health_insurance_provider,
      health_insurance_plan,
    } = req.body;
    const user_id = req.userProfile.userId;

    await patientService.createPatientHIData({
      health_insurance_id,
      health_insurance_plan_id,
      policy_number,
      user_id,
      pps_number,
      gms_number,
      has_medical_card,
      health_insurance_provider,
      health_insurance_plan,
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updatePatientHI = async (req, res) => {
  try {
    const {
      health_insurance_id,
      health_insurance_plan_id,
      policy_number,
      pps_number,
      gms_number,
      has_medical_card,
      health_insurance_provider,
      health_insurance_plan,
      has_insurance,
    } = req.body;

    const { id } = req.params;

    const user_id = req.userProfile.userId;

    await patientService.updatePatientHIData({
      health_insurance_id,
      health_insurance_plan_id,
      policy_number,
      user_id,
      pps_number,
      gms_number,
      has_medical_card,
      health_insurance_provider,
      health_insurance_plan,
      patient_health_insurance_id: id,
      has_insurance,
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  getHIMaster,
  getHIPlanMaster,
  getMyHI,
  createPatientHI,
  updatePatientHI,
};
