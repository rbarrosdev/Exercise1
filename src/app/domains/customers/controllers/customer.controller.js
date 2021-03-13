const express = require("express");
const router = express.Router();

router.post("/customers", async (req, res, next) => {
  const { userId, customerData } = req.body;

  try {
    res.sendStatus(201);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
