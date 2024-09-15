/* eslint-disable indent */
const { nameExists } = require('../appConstants/displayConstant');
const role = require('../appConstants/roleConstant');
const { Tenant, User } = require('../models');
const { getSignedUrl } = require('./s3Service');

const formatTenantList = (tenantList, userTenantList) => {
  const newUserTenatList = userTenantList.map(ele => ele._id.toString());

  const result = tenantList.map(ele => {
    const newTenantObj = {
      tenant_id: ele?.tenant_id,
      name: ele?.name,
      access_type: ele?.access_type,
    };

    if (newUserTenatList?.includes(ele.tenant_id.toString())) {
      newTenantObj.is_share = true;
    } else {
      newTenantObj.is_share = false;
    }

    return newTenantObj;
  });
  return result;
};

const searchTenantsByName = async val => {
  try {
    const regexValue = new RegExp(val, 'i');
    const query = { is_system_added: true };
    if (val) {
      query.name = { $regex: regexValue };
    }

    const result = await Tenant.find(query).select(
      '-created_on -updated_on -__v -is_system_added -unique_name',
    );

    // In this line, we finding the tenant ID of the doctor users
    const tenantIds = await User.distinct('tenant', {
      role: { $in: [role.hcp, role.primaryInvestigator] },
      is_system_added: true,
    });

    const filteredResult = result.filter(
      ele =>
        ele.name &&
        // ele.description && //Hiding it now, because in admin dash we dont have description
        ele.image &&
        (ele.address_line1 || ele.address_line2 || ele.address_line3),
    );

    // In this row, We filter out a which tenant doesn't have a doctor by tenantIds
    const mappedResult = await Promise.all(
      filteredResult
        .filter(ele =>
          JSON.parse(JSON.stringify(tenantIds)).includes(
            JSON.parse(JSON.stringify(ele.tenant_id)),
          ),
        )
        .map(async ele => ({
          name: ele.name || '',
          image: await getSignedUrl(ele.image),
          description: ele.description || '',
          address_line1: ele.address_line1 || '',
          address_line2: ele.address_line2 || '',
          address_line3: ele.address_line3 || '',
          city: ele.city || '',
          country: ele.country || '',
          post_code: ele.post_code || '',
          access_type: ele.access_type || '',
          tenant_id: ele.tenant_id,
          is_distance_enabled: ele.is_distance_enabled,
          address: [
            ele.address_line1,
            ele.address_line2 ? ele.address_line2 : '',
            ele.address_line3 ? ele.address_line3 : '',
            ele.city ? ele.city : '',
            ele.country ? ele.country : '',
          ]
            .filter(Boolean)
            .join(', '),
        })),
    );

    return mappedResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const createOrUpdateMasterTenant = async tenantObj => {
  try {
    return Tenant.findOne({ _id: tenantObj.id }).then(async tenantDetails => {
      if (tenantDetails) {
        return Tenant.updateOne({ _id: tenantObj.id }, { ...tenantObj });
      }

      const isExists = await Tenant.exists({ name: tenantObj.name });

      if (!isExists) {
        return Tenant.create({
          ...tenantObj,
        });
      }

      throw new Error(nameExists);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateUserTenantData = async (reqBody, user_id, id) => {
  try {
    const user = await User.findOne({ _id: user_id });
    if (reqBody.is_share) {
      user.tenant.addToSet(id);
    } else {
      user.tenant.pull(id);
    }

    await user.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const listOfUserTenants = async user_id => {
  try {
    const tenantList = await searchTenantsByName();
    const userTenantList = await User.findById(user_id).select('tenant');
    const result =
      tenantList &&
      userTenantList?.tenant &&
      formatTenantList(tenantList, userTenantList.tenant);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const checkTenantExists = async name => {
  try {
    const tenantExists = await Tenant.exists({
      name,
    });

    return tenantExists;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  createOrUpdateMasterTenant,
  searchTenantsByName,
  listOfUserTenants,
  updateUserTenantData,
  checkTenantExists,
};
