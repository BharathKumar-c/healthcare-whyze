const { dashboardService } = require('../../services');

const getOrganizationsCount = async (req, res) => {
  try {
    const result = await dashboardService.getHospitalAndOrganizationsCount();
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = { getOrganizationsCount };
