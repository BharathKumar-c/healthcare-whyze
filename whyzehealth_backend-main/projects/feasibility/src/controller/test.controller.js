const { TestService } = require('../service');

const test = async (req, res) => {
  try {
    const testRes = await TestService.testMsg();
    return res.status(200).json({ testRes });
  } catch (error) {
    return res.sendStatus(400);
  }
};

module.exports = { test };
