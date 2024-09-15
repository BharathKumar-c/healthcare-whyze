const { success, nameExists } = require('../appConstants/displayConstant');
const { PatientDoctorMapper, User, Tenant } = require('../models');
const { updateUserDetails, getPatientByUserId } = require('./patientService');
const { getSignedUrl } = require('./s3Service');
const {
  checkTenantExists,
  createOrUpdateMasterTenant,
} = require('./tenantService');

const formatTenantDetails = async patientDoctorMapper => ({
  patient_doctor_mapper_id: patientDoctorMapper?.patient_doctor_mapper_id,
  hcp_id: patientDoctorMapper?.hcp?._id,
  hcp_name: `${patientDoctorMapper?.hcp?.first_name || ''} ${
    patientDoctorMapper?.hcp?.last_name || ''
  }`,
  tenant: await Promise.all(
    patientDoctorMapper?.hcp?.tenant?.map(async tenant => ({
      tenant_id: tenant?._id,
      name: tenant?.name,
      unique_name: tenant?.unique_name,
      is_system_added: tenant?.is_system_added,
      image: tenant?.image && (await getSignedUrl(tenant.image)),
      description: tenant?.description,
      address_line1: tenant?.address_line1,
      address_line2: tenant?.address_line2,
      address_line3: tenant?.address_line3,
      city: tenant?.city,
      post_code: tenant?.post_code,
      country: tenant?.country,
    })),
  ),
  is_connected: patientDoctorMapper?.is_connected,
  is_custom_added: !patientDoctorMapper?.hcp?.tenant[0]?.is_system_added,
});

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

    const result = await Promise.all(
      patientDoctorMapper.map(async ele => formatTenantDetails(ele)),
    );

    return result;
  } catch (error) {
    console.error(error);
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
            select: '-created_by -updated_by -created_on -updated_on -__v',
          },
          select:
            '-patient_detail -preference -dob -role -created_by -email_verified -email_verification_token -password -updated_by -created_on -updated_on -__v',
        },
      ]);
    if (patientDoctorMapper) {
      const result = await formatTenantDetails(patientDoctorMapper);
      return result;
    }
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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

      const tenant = await createOrUpdateMasterTenant({
        ...tenantDoctorObj.tenantDetails,
        created_by: user_id,
      });
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
    console.error(error);
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
      if (
        tenantDoctorObj?.userDetails?.first_name &&
        tenantDoctorObj?.tenantDetails?.name
      ) {
        const tenantExists = await checkTenantExists(
          tenantDoctorObj.tenantDetails.name,
        );

        if (tenantExists) {
          throw new Error(nameExists);
        }

        const tenant = await createOrUpdateMasterTenant({
          ...tenantDoctorObj.tenantDetails,
          created_by: user_id,
        });
        const user = await User.create({
          ...tenantDoctorObj.userDetails,
          tenant: tenant._id,
          updated_by: user_id,
          created_by: user_id,
        });

        return PatientDoctorMapper.updateOne(
          { patient: patient_id, _id: patient_doctor_mapper_id },
          {
            hcp: user.user_id,
            is_connected: tenantDoctorObj.tenantDetails.is_connected,
            updated_by: user_id,
          },
        );
      }
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
    if (tenantDetails.hcp_id) {
      if (patientDoctorMapper.hcp_id !== tenantDetails.hcp_id) {
        await Tenant.deleteOne({
          _id: patientDoctorMapper.tenant[0]._id,
          is_system_added: false,
          created_by: user_id,
        });
        await User.deleteOne({
          _id: patientDoctorMapper.hcp_id,
          is_system_added: false,
          created_by: user_id,
        });
      }
      return PatientDoctorMapper.updateOne(
        { patient: patient_id, _id: patient_doctor_mapper_id },
        {
          hcp: tenantDetails.hcp_id,
          is_connected: tenantDetails.is_connected,
          updated_by: user_id,
        },
      );
    }
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
    console.error(error);
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
