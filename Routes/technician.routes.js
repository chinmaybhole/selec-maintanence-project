const express = require('express')
const routers = express.Router();
const technicianControllers = require('../Controllers/technician.controllers')

routers.post('/upload', technicianControllers.imageUpload);

module.exports = routers;