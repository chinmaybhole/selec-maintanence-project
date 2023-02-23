const express = require("express");
const {
  add_asset_templates,
  add_asset,
  select_template,
} = require("../Controllers/master.controller");
const { checkAuth, checkRole } = require("../Middleware/checkAuth.middleware");
const config = require("../Config/config.json");

router = express.Router();

router.post(
  "/add_asset_templates",
  checkAuth,
  checkRole(config.ROLE.ADMIN),
  add_asset_templates
);

router.post("/add_asset", checkAuth, checkRole(config.ROLE.ADMIN), add_asset);

router.get(
  "/select_template",
  checkAuth,
  checkRole(config.ROLE.ADMIN),
  select_template
);

module.exports = router;
