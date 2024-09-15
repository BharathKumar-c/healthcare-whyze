const { noDoctorFound } = require('../appConstants/displayConstant');
const { User } = require('../models');

const searchDoctorsByName = async (tenant_id, name) => {
  try {
    const regexValue = new RegExp(name, 'i');
    const result = await User.find({
      tenant: { $in: [tenant_id] },
      $or: [
        {
          first_name: { $regex: regexValue },
        },
        { last_name: { $regex: regexValue } },
      ],
      role: 'hcp',
    }).select({
      name: { $concat: ['$first_name', ' ', '$last_name'] },
    });

    if (!result.length) {
      throw new Error(noDoctorFound);
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  searchDoctorsByName,
};
