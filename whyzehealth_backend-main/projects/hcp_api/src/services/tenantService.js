/* eslint-disable indent */
const { nameExists } = require('../appConstants/displayConstant');
const { Tenant, User } = require('../models');

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
    const query = val
      ? {
          name: { $regex: regexValue },
          $or: [
            { is_system_added: true },
            { is_system_added: { $exists: false } },
          ],
        }
      : {
          $or: [
            { is_system_added: true },
            { is_system_added: { $exists: false } },
          ],
        };
    const result = await Tenant.find(query).select(
      '-created_on -updated_on -__v -is_system_added -unique_name',
    );

    return result.map(ele => ({
      name: ele.name || '',
      image: ele.image || '',
      description: ele.description || '',
      address_line1: ele.address_line1 || '',
      address_line2: ele.address_line2 || '',
      address_line3: ele.address_line3 || '',
      city: ele.city || '',
      country: ele.country || '',
      post_code: ele.post_code || '',
      access_type: ele.access_type || '',
      tenant_id: ele.tenant_id,
    }));
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
