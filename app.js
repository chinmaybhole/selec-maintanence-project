
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./Config/db.connect')
const cors = require('cors')
require('dotenv').config({ path: './Config/.env' });
const { agenda, init } = require('./Config/agendaconfig');
// init()
var Agendash = require("agendash");
// initialize express
const app = express();

// Body-Parser initialization
app.use(bodyParser.json());
// Database Connection
connection();

// Setting up CORS config
app.use(cors());

// Agenda Dashboard
app.use("/dash", Agendash(agenda));

// Import Routes
const Loginroute = require("./Routes/Login.routes"); // Login routes
app.use("/login", Loginroute);
const adminRoutes = require("./Routes/admin.routes"); // Admin routes
app.use("/admin", adminRoutes);
const requesteeRoutes = require("./Routes/requestee.routes"); // Requestee routes
app.use("/requestee", requesteeRoutes);
const techinternalroutes = require("./Routes/technician.routes"); // Technician routes
app.use("/technician", techinternalroutes);
const DummyRoute = require("./Routes/test.routes"); // Dummy routes
app.use("/test", DummyRoute);
const masterRoute = require("./Routes/master.routes"); // Master routes
app.use("/master", masterRoute);

// default and incorrect route
app.get("/", (req, res) => {
  res.send("Selec Server");
});

//Testing post of master template
// app.post("/master/add_asset_templates", (req, res) => {
//   try {
//     // req.body = utils.lowercasedata(req.body)
//     let jsonData = req.body;
//     let name = req.body.template_name;
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

app.post("/master/add_asset_templates", (req, res) => {
  try {
    const schema = req.body;
    let newSchema = new mongoose.Schema(schema);
    let NewSchema = mongoose.model("NewSchema", newSchema);

    // Save Schemas in the list of Select template Schemas

    let test = new NewSchema({
      template_name: "Mobile",
      devices: "Motog5",
    });

    test.save();

    res.status(200).send(test);
  } catch (err) {
    console.log(err);
  }
});

app.post("/master/testing_template", (req, res) => {
  try {
    const body = req.body;
  } catch (err) {
    console.log(err);
  }
});

// app.post("/master/add_assets", (req, res) => {
//   // Add Assets from CSV
//   try {
//     // req.body = utils.lowercasedata(req.body)
//     mongoose.model(
//       "computertemplates",
//       new Schema(
//         {
//           model: String,
//           asset_id: Number,
//           name: String,
//         },
//         { collection: "computertemplates" }
//       )
//     );

//     // const newAsset = new Asset(req.body)
//     // console.log(newAsset)
//     console.log(mongoose.model("computertemplates").schema);
//     res.json({ msg: "Testing adding assets" });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: error.message });
//   }
// });

app.use("*", (req, res) => {
  return res.status(404).json({ msg: "Request Not Found" });
});

// app connection

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Cors-enable Server running on http://localhost:${PORT}`);
});

