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
app.use(cors())

// Agenda Dashboard
app.use("/dash", Agendash(agenda));

// Import Routes
const Loginroute = require('./Routes/Login.routes') // Login routes
app.use('/login', Loginroute);
const adminRoutes = require('./Routes/admin.routes') // Admin routes
app.use('/admin', adminRoutes);
const requesteeRoutes = require('./Routes/requestee.routes') // Requestee routes
app.use('/requestee', requesteeRoutes)
const techinternalroutes = require('./Routes/technician.routes'); // Technician routes
app.use('/technician', techinternalroutes)
const DummyRoute = require('./Routes/test.routes') // Dummy routes
app.use('/test', DummyRoute)

// default and incorrect route
app.get('/', (req, res) => {
    res.send("Selec Server");
})
app.use("*", (req, res) => {
    return res.status(404).json({ msg: "Request Not Found" })
})

// app connection
const PORT = process.env.PORT || 8080
app.listen(PORT, () => { console.log(`Cors-enable Server running on http://localhost:${PORT}`) })