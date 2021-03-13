const axios = require("axios");

module.exports = {
  // 3 options for this, api call, messaging service, log to a file for bulk sending
  async addNewCustomer(userId, customerData) {
    const customerServiceUrl =
      process.env.CUSTOMERSERVICEURL || "http://localhost:3000";
    console.log({ url: customerServiceUrl });
    await axios.post(`${customerServiceUrl}/api/customers`, {
      userId,
      customerData
    });
  }
};
