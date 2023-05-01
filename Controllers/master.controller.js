const mongoose = require("mongoose");
const { addTemp } = require("../Models/addtemplate.model.js");

const add_asset_templates = async (req, res) => {
  `
    API Body sample:
    {
        "template_name":"phone",
        "model":"String",
        "price":"Number"
        
    
    }`;

  try {
    const schema = req.body;
    let name = req.body.template_name;
    delete schema["template_name"];
    let newTemp = new mongoose.Schema(schema);
    // Schema Name
    let NewSchema = mongoose.model(name + "Temp", newTemp);

    // Save Schemas in the list of Select template Schemas
    let addtemplate = new addTemp({
      template_name: name,
      schema_structure: newTemp.obj,
    });

    await addtemplate.save();

    res.status(200).send(`${NewSchema}`);
  } catch (err) {
    res.status(501).send(err);
  }
};

const add_asset = (req, res) => {
  "Testing in progress";
  try {
    const body = req.body;
    res.status(200).send(newSchema);
  } catch (err) {
    console.log(err);
  }
};

const select_template = async (req, res) => {
  try {
    let select_template = await addTemp.find();
    res.status(200).send(select_template);
  } catch (err) {
    console.log(err);
  }
};

const uploadAndValidateCsv = async (req, res) => {
  /* 
  Validate the csv data according to the template name and add to the asset collections 
  - Add to asset collection
  - Validate the data
  */
  try {
    const model = req.body.template_name;
    // open uploaded file
    const modelName = await addTemp.findOne({ template_name: model });

    const schema = modelName.schema_structure[0];
    const dynamicSchema = new mongoose.Schema(schema);
    const Model = mongoose.model(
      `${modelName.template_name}temps`,
      dynamicSchema
    );

    const jsonData = await csvtojson().fromFile(req.file.path);
    for (const row of jsonData) {
      // validate each row here and add any errors to the `errors` array
      try {
        const newModel = new Model(row);
        await newModel.save();
      } catch (err) {
        errors.push(err.message);
      }
    }
    res.status(200).send(`${model} : Template name  `);
  } catch (err) {
    console.log(err);
    res.status(500).send("Err");
  }
};

const deleteTemplate = async (req, res) => {
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
};

module.exports = {
  add_asset_templates,
  add_asset,
  select_template,
  uploadAndValidateCsv,
  deleteTemplate,
};
//Testing post of master template
// app.post("/master/add_asset_templates", (req, res) => {
//   try {
//     // req.body = utils.lowercasedata(req.body)
//     let jsonData = req.body;
// let name = req.body.template_name;
//     delete jsonData["template_name"];
//     let MongooseSchema = generateSchema.mongoose(jsonData);
//     // primary_keys and elements DEFAULT parameter
//     // console.log(typeof(MongooseSchema));
//     template = mongoose.model(name + "Template", MongooseSchema);
//     res.json({ msg: `Template name created ${name}Template` });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: error.message });
//   }
// });
