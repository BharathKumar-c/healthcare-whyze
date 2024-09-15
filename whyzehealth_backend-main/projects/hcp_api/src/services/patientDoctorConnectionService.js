const { success, nameExists } = require('../appConstants/displayConstant');
const { PatientDoctorMapper, User } = require('../models');
const { updateUserDetails, getPatientByUserId } = require('./patientService');
const {
  checkTenantExists,
  createOrUpdateMasterTenant,
} = require('./tenantService');

const getAllConnectedDoctors = async patient_id => {
  try {
    const patientDoctorMapper = await PatientDoctorMapper.find({
      patient: patient_id,
    })
      .select('patient_doctor_mapper_id hcp is_connected')
      .populate([
        {
          path: 'hcp',
          model: 'User',
          populate: {
            path: 'tenant',
            model: 'Tenant',
            select: '-created_by -updated_by -created_on -updated_on -__v',
          },
          select:
            '-patient_detail -preference -dob -role -created_by -email_verified -email_verification_token -password -updated_by -created_on -updated_on -__v',
        },
      ]);

    const result = patientDoctorMapper.map(ele => ({
      patient_doctor_mapper_id: ele?.patient_doctor_mapper_id,
      hcp_id: ele?.hcp?._id,
      hcp_name: `${ele?.hcp?.first_name || ''} ${ele?.hcp?.last_name || ''}`,
      tenant: ele?.hcp?.tenant?.map(tenant => ({
        tenant_id: tenant?._id,
        name: tenant?.name,
        unique_name: tenant?.unique_name,
        is_system_added: tenant?.is_system_added,
        image: tenant?.image,
        description: tenant?.description,
        address: tenant?.address,
      })),
      is_connected: ele?.is_connected,
      is_custom_added: !ele?.hcp?.tenant[0]?.is_system_added,
    }));
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getConnectedDoctorDataById = async (patient_mapper_id, patient_id) => {
  try {
    const patientDoctorMapper = await PatientDoctorMapper.findOne({
      _id: patient_mapper_id,
      patient: patient_id,
    })
      .select('patient_doctor_mapper_id hcp is_connected')
      .populate([
        {
          path: 'hcp',
          model: 'User',
          populate: {
            path: 'tenant',
            model: 'Tenant',
            select: ' -created_by -updated_by -created_on -updated_on -__v',
          },
          select:
            '-patient_detail -preference -dob -role -created_by -email_verified -email_verification_token -password -updated_by -created_on -updated_on -__v',
        },
      ]);
    if (patientDoctorMapper) {
      const result = {
        patient_doctor_mapper_id: patientDoctorMapper?.patient_doctor_mapper_id,
        hcp_id: patientDoctorMapper?.hcp?._id,
        hcp_name: `${patientDoctorMapper?.hcp?.first_name || ''} ${
          patientDoctorMapper?.hcp?.last_name || ''
        }`,
        tenant: patientDoctorMapper?.hcp?.tenant,
        is_connected: patientDoctorMapper?.is_connected,
        is_custom_added: !patientDoctorMapper?.hcp?.tenant[0]?.is_system_added,
      };
      return result;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createOrUpdateDoctorConnection = async (doctorObj, user_id) => {
  try {
    const patientDoctorConnectionDetail = await PatientDoctorMapper.findOne({
      patient: doctorObj.patient,
      hcp: doctorObj.hcp,
    });

    if (patientDoctorConnectionDetail) {
      return PatientDoctorMapper.updateOne(
        { patient: doctorObj.patient, hcp: doctorObj.hcp },
        { ...doctorObj, updated_by: user_id },
      );
    }

    const patientDoctorConnect = await PatientDoctorMapper.create({
      ...doctorObj,
      created_by: user_id,
      updated_by: user_id,
    });

    return patientDoctorConnect;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deletePatientDoctorConnection = async (patient_id, doctor_mapper_id) => {
  try {
    await PatientDoctorMapper.deleteOne({
      patient: patient_id,
      _id: doctor_mapper_id,
    });
    return { message: success };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const mapPatientDoctor = async (tenantDoctorObj, user_id) => {
  try {
    const patient = await getPatientByUserId(user_id);

    if (tenantDoctorObj?.tenantDetails?.hcp_id) {
      const doctorConnection = await createOrUpdateDoctorConnection({
        patient: patient._id,
        hcp: tenantDoctorObj.tenantDetails.hcp_id,
        is_connected: tenantDoctorObj.tenantDetails.is_connected,
      });

      if (doctorConnection._id) {
        patient.hcp_list.addToSet(doctorConnection._id);
      }
    } else {
      const tenantExists = await checkTenantExists(
        tenantDoctorObj.tenantDetails.name,
      );

      if (tenantExists) {
        throw new Error(nameExists);
      }

      const tenant = await createOrUpdateMasterTenant(
        tenantDoctorObj.tenantDetails,
      );
      const user = await User.create({
        ...tenantDoctorObj.userDetails,
        tenant: tenant._id,
        updated_by: user_id,
        created_by: user_id,
      });

      const doctorConnection = await createOrUpdateDoctorConnection({
        patient: patient._id,
        hcp: user._id,
        is_connected: tenantDoctorObj.tenantDetails.is_connected,
      });

      patient.hcp_list.addToSet(doctorConnection._id);
    }

    await patient.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updatePatientDoctor = async ({
  tenantDoctorObj,
  user_id,
  patient_id,
  patient_doctor_mapper_id,
}) => {
  try {
    const patientDoctorMapper = await getConnectedDoctorDataById(
      patient_doctor_mapper_id,
      patient_id,
    );
    if (!patientDoctorMapper.is_custom_added) {
      return PatientDoctorMapper.updateOne(
        { patient: patient_id, _id: patient_doctor_mapper_id },
        {
          hcp: tenantDoctorObj.tenantDetails.hcp_id,
          is_connected: tenantDoctorObj.tenantDetails.is_connected,
          updated_by: user_id,
        },
      );
    }
    const { tenantDetails, userDetails } = tenantDoctorObj;

    if (tenantDetails.id) {
      await createOrUpdateMasterTenant(tenantDetails);
    }

    if (userDetails.id) {
      await updateUserDetails(userDetails, userDetails.id);
    }

    return PatientDoctorMapper.updateOne(
      { patient: patient_id, _id: patient_doctor_mapper_id },
      {
        hcp: userDetails._id,
        is_connected: tenantDetails.is_connected,
        updated_by: user_id,
      },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getAllConnectedDoctors,
  getConnectedDoctorDataById,
  mapPatientDoctor,
  createOrUpdateDoctorConnection,
  updatePatientDoctor,
  deletePatientDoctorConnection,
};
