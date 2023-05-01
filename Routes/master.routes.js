const express = require("express");
const {
  add_asset_templates,
  add_asset,
  select_template,
  uploadAndValidateCsv,
  deleteTemplate,
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

router.get("/get_asset_collection", async (req, res) => {
  try {
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        const tempCollections = collections.filter((collection) =>
          collection.name.endsWith("temps")
        );
        tempCollections.forEach((collection) => {
          const tempCollection = mongoose.connection.db.collection(
            collection.name
          );

          tempCollection.find().toArray((err, documents) => {
            console.log("Hello World");

            if (err) {
              // Handle error
            } else {
              const schema = mongoose.Schema({});
              const assetdataCollection = mongoose.connection.db.collection(
                "tempassetdata",
                schema
              );
              assetdataCollection.insertMany(documents, (err, result) => {
                if (err) {
                  console.log(err);
                  // Handle error
                } else {
                  console.log(
                    `Inserted ${result.insertedCount} documents into assetdata collection`
                  );
                  res
                    .status(200)
                    .send(
                      `Inserted ${result.insertedCount} documents into assetdata collection`
                    );
                }
              });
              // Do something with the temp collections
            }
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// Validation & Database
router.post(
  "/upload_csv",
  upload.single("file"),
  checkAuth,
  checkRole(config.ROLE.ADMIN),
  uploadAndValidateCsv
);

router.delete(
  "/delete_template",
  checkAuth,
  checkRole(config.ROLE.ADMIN),
  deleteTemplate
);

router.patch(
  "/update_template",
  checkAuth,
  checkRole(config.ROLE.ADMIN),
  async (req, res) => {
    //
    try {
      const temp_name = req.body.template_name;
      const temp = await addTemp.findOne({ template_name: temp_name });
      res.status(200).send(temp);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

module.exports = router;

// router.post("/create-document", async (req, res) => {
//   // Extract the document data from the request body
//   const { model, data } = req.body;

//   try {
//     const modelName = await addTemp.findOne({ template_name: model });

//     if (modelName) {
//       // console.log(modelName.template_name);
//       // console.log(modelName.schema_structure[0]);
//       const schema = modelName.schema_structure[0];
//       const dynamicSchema = new mongoose.Schema(schema);

//       const Model = mongoose.model(
//         `${modelName.template_name}temps`,
//         dynamicSchema
//       );
//       const newModel = new Model(data);
//       // const document = await Model.create(data);
//       await newModel.save();
//       res.send({ newModel });
//     }

//     // Get the dynamic model object from the request
//     // const Model = mongoose.model(model);

//     // Create a new document using the dynamic model

//     // Send a response with the new document object
//     res.send("Outside if");
//   } catch (err) {
//     console.error("Error creating document", err);
//     res.status(500).send("Error creating document");
//   }
// });
