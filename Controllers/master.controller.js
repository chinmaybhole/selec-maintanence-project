const mongoose = require("mongoose");
const { addTemp } = require("../Models/addtemplate.model.js");

const add_asset_templates = async (req, res) => {
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

    res.status(200).send(addtemplate);
  } catch (err) {
    console.log(err);
  }
};

const add_asset = (req, res) => {
  try {
    const body = req.body;
    let newSchema = mongoose.model("phoneTemp");
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
module.exports = { add_asset_templates, add_asset, select_template };
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
