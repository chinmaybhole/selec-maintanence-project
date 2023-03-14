const express = require("express");
const {
  add_asset_templates,
  add_asset,
  select_template,
} = require("../Controllers/master.controller");
const { checkAuth, checkRole } = require("../Middleware/checkAuth.middleware");
const config = require("../Config/config.json");
const csv = require("fast-csv");
const multer = require("multer");
const upload = multer({ dest: "tmp/csv/" });
const fs = require("fs");
const { validateCsvData } = require("../Helper/master.helper.js");
const { addTemp } = require("../Models/addtemplate.model");
const mongoose = require("mongoose");

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

// Validation & Database
router.post("/upload_csv", upload.single("file"), async (req, res) => {
  try {
    const fileRows = [];

    // open uploaded file
    csv
      .parseFile(req.file.path)
      .on("data", (data) => {
        fileRows.push(data); // push each row
      })
      .on("end", () => {
        console.log(fileRows);
        // Database me entry Helper function
        fs.unlinkSync(req.file.path); // remove temp file
        //process "fileRows" and respond
        // const validationError = validateCsvData(fileRows);
        // if (validationError) {
        //   console.log("Hello World!!!");
        //   return res.status(403).json({ error: validationError });
        // }

        // For loop model.collection.insert({asset_name: ${row[0]},asset_id: ${row[1]},Category: ${row[2]}})
        res.status(202).send("Valid CSV");
      });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/delete_template", async (req, res) => {
  // template name as an input and delete that template name from add_Temp
  // Template should not be able to delete template data if any data is there if no data then delete it
  try {
    const temp_name = req.body.template_name;
    const temp = await addTemp.deleteOne({ template_name: temp_name });

    res.status(200).send(temp);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch("/update_template", async (req, res) => {
  //
  try {
    const temp_name = req.body.template_name;
    const temp = await addTemp.findOne({ template_name: temp_name });
    res.status(200).send(temp);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
