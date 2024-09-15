const { appointmentService } = require('../../services');

const createAppoinment = async (req, res) => {
  try {
    const { appointmentData } = req.body;
    if (!appointmentData) {
      return res.status(400).send();
    }
    const result = await appointmentService.createPatientAppoinment(
      appointmentData,
    );
    return res.status(200).send(result && { message: 'Appointment created' });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  createAppoinment,
};
