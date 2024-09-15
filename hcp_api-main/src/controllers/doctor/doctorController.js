const { doctorService } = require('../../services');

const searchDoctorsByName = async (req, res) => {
  try {
    const name = req.query?.name;
    const { id } = req.params;

    const result = await doctorService.searchDoctorsByName(id, name);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  searchDoctorsByName,
};
