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
const csvtojson = require("csvtojson");

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
    const model = req.body.template_name;
    // open uploaded file

    const modelName = await addTemp.findOne({ template_name: model });

    const schema = modelName.schema_structure[0];
    const dynamicSchema = new mongoose.Schema(schema);
    const Model = mongoose.model(
      `${modelName.template_name}temps`,
      dynamicSchema
    );

    // res.send({ newModel });

    // csv
    //   .parseFile(req.file.path)
    //   .on("data", (data) => {
    //     console.log(data);
    //     fileRows.push(data); // push each row
    // const newModel = new Model(data);
    // newModel.save().then(() => console.log("Save csv data"));
    //   })
    // .on("end", () => {
    //   console.log(fileRows);
    //   // Database me entry Helper function
    //   fs.unlinkSync(req.file.path); // remove temp file
    //   //process "fileRows" and respond
    //   // const validationError = validateCsvData(fileRows);
    //   // if (validationError) {
    //   //   console.log("Hello World!!!");
    //   //   return res.status(403).json({ error: validationError });
    //   // }

    //   // For loop model.collection.insert({asset_name: ${row[0]},asset_id: ${row[1]},Category: ${row[2]}})
    //   res.status(202).send(`${model} : Template name  `);
    // });
    // const fileRows = [];
    // open uploaded file

    const jsonData = await csvtojson().fromFile(req.file.path);
    console.log(jsonData);
    for (const row of jsonData) {
      // validate each row here and add any errors to the `errors` array
      try {
        console.log("Hello world", row);
        const newModel = new Model(row);
        await newModel.save();
      } catch (err) {
        console.log("Catchhh");
        errors.push(err.message);
      }
    }
    res.status(200).send(`${model} : Template name  `);
    // Upload csv new model using model name
    // if (!foundtemplate) {
    //   const newtemp = new addTemp({ template_name });
    //   // foundtemplate = await newtemp.save();
    //   csv
    //     .parseFile(req.file.path)
    //     .on("data", (data) => {
    //       await collection1.insertOne(data)
    //       fileRows.push(data); // push each row
    //     })
    //     .on("end", () => {
    //       // Database me entry Helper function
    //       fs.unlinkSync(req.file.path); // remove temp file
    //       //process "fileRows" and respond
    //       const validationError = validateCsvData(fileRows);
    //       if (validationError) {
    //         return res.status(403).send(validationError);
    //       }
    //       // For loop model.collection.insert({asset_name: ${row[0]},asset_id: ${row[1]},Category: ${row[2]}})
    //     });
    //   res.status(202).send(`File Rows: ${fileRows}`);
    // }
    // res.status(400).send("Template already exists,try other template name");
    // } catch (err) {
    //   res.status(500).send(err);
    // }

    // res.status(200).json({ message: "Data saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Err");
  }
});
router.post("/create-document", async (req, res) => {
  // Extract the document data from the request body
  const { model, data } = req.body;

  try {
    const modelName = await addTemp.findOne({ template_name: model });

    if (modelName) {
      // console.log(modelName.template_name);
      // console.log(modelName.schema_structure[0]);
      const schema = modelName.schema_structure[0];
      const dynamicSchema = new mongoose.Schema(schema);

      const Model = mongoose.model(
        `${modelName.template_name}temps`,
        dynamicSchema
      );
      const newModel = new Model(data);
      // const document = await Model.create(data);
      await newModel.save();
      res.send({ newModel });
    }

    // Get the dynamic model object from the request
    // const Model = mongoose.model(model);

    // Create a new document using the dynamic model

    // Send a response with the new document object
    res.send("Outside if");
  } catch (err) {
    console.error("Error creating document", err);
    res.status(500).send("Error creating document");
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
