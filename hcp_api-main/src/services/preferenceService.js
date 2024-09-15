const { Preference, PreferenceTenantMapper, User } = require('../models');
const { getSignedUrl } = require('./s3Service');

const formatPreferenceDetails = async preferenceDetails => {
  const {
    _id,
    surveys,
    clinical_trials,
    pseudonymised_data,
    preference_tenant_mapper,
    therapeutic_areas,
  } = preferenceDetails;

  const result = {
    preference_id: _id,
    surveys,
    clinical_trials,
    pseudonymised_data,
    therapeutic_areas,
  };

  if (preference_tenant_mapper) {
    const { tenant, travel_distance, is_connected, hospital_number } =
      preference_tenant_mapper;

    if (tenant) {
      const { _id: tenant_id, name, image, description, address } = tenant;
      result.tenant_id = tenant_id;
      result.name = name;
      result.image = image && (await getSignedUrl(image));
      result.description = description;
      result.address = address;
    }

    if (travel_distance) {
      result.travel_distance = travel_distance;
    }

    result.is_connected = is_connected;
    result.hospital_number = hospital_number || '';
  }

  return result;
};

const getPreferenceDetails = async user_id => {
  try {
    const preferenceDetails = await Preference.findOne({
      patient: user_id,
    })
      .select(' -patient -created_on -updated_on -updated_by -created_by -__v')
      .populate({
        path: 'preference_tenant_mapper',
        model: 'preferenceTenantMapper',
        select: '-created_on -updated_on -updated_by -created_by -__v',
        populate: {
          path: 'tenant',
          model: 'Tenant',
          select: '-created_on -updated_on -__v',
        },
      });
    const user = await User.findOne({ _id: user_id })
      .select('preference therapeutic_areas')
      .populate({
        path: 'therapeutic_areas',
        model: 'TherapeuticAreas',
        select: '-created_on -updated_on -__v',
      })
      .populate({
        path: 'preference',
        model: 'Preference',
        select: '-created_on -updated_on -__v',
        populate: {
          path: 'preference_tenant_mapper',
          model: 'preferenceTenantMapper',
          select: '-created_on -updated_on -__v',
          populate: {
            path: 'tenant',
            model: 'Tenant',
            select: '-created_on -updated_on -__v',
            populate: {
              path: 'therapeutic_areas',
              model: 'TherapeuticAreas',
              select: '-created_on -updated_on -__v',
            },
          },
        },
      });
    let userTherapeuticAreasList = [];
    if (user.therapeutic_areas) {
      userTherapeuticAreasList = user.therapeutic_areas.map(area =>
        area._id.toString(),
      );
    }

    if (
      user.preference &&
      user.preference.preference_tenant_mapper &&
      user.preference.preference_tenant_mapper.tenant
    ) {
      const { tenant } = user.preference.preference_tenant_mapper;

      if (tenant.therapeutic_areas) {
        const tenantTherapeuticAreas = tenant.therapeutic_areas.map(area => ({
          ...area.toObject(),
          isEnabled:
            userTherapeuticAreasList.length > 0
              ? userTherapeuticAreasList.includes(area._id.toString())
              : false,
        }));

        const resultTenantTherapeuticAreas = [...tenantTherapeuticAreas];
        preferenceDetails.therapeutic_areas = resultTenantTherapeuticAreas;
      }
    } else {
      const tenantTherapeuticAreas = [];
      preferenceDetails.therapeutic_areas = tenantTherapeuticAreas;
    }

    const result = formatPreferenceDetails(preferenceDetails);
    return result;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const createOrUpdatePatientPreferenceMap = async (preferenceObj, user_id) => {
  try {
    const preferenceData = await Preference.findOne({ patient: user_id });
    const preferenceTenantMap = await PreferenceTenantMapper.findOne({
      preference: preferenceData._id,
    });

    if (preferenceTenantMap) {
      const { is_active, is_connected } = preferenceObj;
      let removeColumn;

      if (is_active === false) {
        removeColumn = 'tenant';
      } else if (is_connected === false) {
        removeColumn = 'travel_distance';
      }

      if (removeColumn) {
        // eslint-disable-next-line no-param-reassign
        delete preferenceObj[removeColumn];
      }

      const updateQuery = removeColumn ? { $unset: { [removeColumn]: 1 } } : {};
      const updateObj = { ...preferenceObj, updated_by: user_id };

      await PreferenceTenantMapper.updateOne(
        { _id: preferenceTenantMap._id },
        { ...updateQuery, ...updateObj },
      );
    } else {
      const createdPreferenceTenantMap = await PreferenceTenantMapper.create({
        ...preferenceObj,
        preference: preferenceData._id,
        created_by: user_id,
        updated_by: user_id,
      });

      preferenceData.preference_tenant_mapper = createdPreferenceTenantMap._id;
      await preferenceData.save();
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const updatePreference = async (patientObj, user_id, preference_id) => {
  try {
    await Preference.updateOne(
      { patient: user_id, _id: preference_id },
      { ...patientObj, updated_by: user_id },
    );

    await User.updateOne(
      { _id: user_id },
      { next_notification_time: null, notification_sent_count: null },
    );

    if (patientObj.clinical_trials !== undefined) {
      await createOrUpdatePatientPreferenceMap(
        {
          travel_distance: patientObj.travel_distance,
          preference: preference_id,
          is_connected: patientObj.clinical_trials,
        },
        user_id,
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTherapeuticAreas = async (user_id, id) => {
  try {
    const user = await User.findOne({ _id: user_id });
    if (user.therapeutic_areas.includes(id)) {
      user.therapeutic_areas.pull(id);
    } else {
      user.therapeutic_areas.addToSet(id);
    }

    await user.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getPreferenceDetails,
  createOrUpdatePatientPreferenceMap,
  updatePreference,
  updateTherapeuticAreas,
};
