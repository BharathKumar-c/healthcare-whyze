const {
  tenantsUpdatemessage,
  success,
} = require('../../appConstants/displayConstant');
const { tenantService } = require('../../services');

const searchMasterTenantsByName = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await tenantService.searchTenantsByName(name);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const createMasterTenant = async (req, res) => {
  try {
    const reqBody = req.body;
    await tenantService.createOrUpdateMasterTenant(reqBody);
    return res.status(200).send({ message: success });
  } catch (error) {
    return res.status(400).send({ message: error?.message || '' });
  }
};

const updateUserTenant = async (req, res) => {
  const reqBody = req.body;
  const { id } = req.params;
  try {
    await tenantService.updateUserTenantData(
      reqBody,
      req.userProfile.userId,
      id,
    );
    return res.status(201).send({ message: `${tenantsUpdatemessage}` });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const listOfUserTenants = async (req, res) => {
  try {
    const tenantData = await tenantService.listOfUserTenants(
      req.userProfile.userId,
    );
    return res.status(200).send({
      tenantData,
    });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
module.exports = {
  createMasterTenant,
  searchMasterTenantsByName,
  updateUserTenant,
  listOfUserTenants,
};
