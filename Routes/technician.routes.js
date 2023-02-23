const express = require('express')
const routers = express.Router();
const technicianControllers = require('../Controllers/technician.controllers')
const TicketControllers = require('../Controllers/ticket.controllers')
const { checkAuth, checkRole } = require('../Middleware/checkAuth.middleware')
const config = require('../Config/config.json')
const { upload } = require('../Middleware/imageUpload.middleware')
const {uploadImage} = require('../Services/firebase')

// Upload Image
routers.post('/upload', checkAuth, checkRole(config.ROLE.TECHNICIAN_INTERNAL), upload.single('image'), uploadImage, technicianControllers.imageUpload);

// get accepted tickets
routers.get('/workorder', checkAuth, checkRole(config.ROLE.TECHNICIAN_INTERNAL), technicianControllers.workOrder);

// get tickets according to technician skills
routers.get('/ticketdisplay', checkAuth, checkRole(config.ROLE.TECHNICIAN_INTERNAL), technicianControllers.ticketDisplay);

// update ticket
routers.put('/updateTicket/:ticketid', checkAuth, checkRole(config.ROLE.TECHNICIAN_INTERNAL), TicketControllers.updateRequesteeTicket)

// close ticket
routers.patch('/closeTicket/:ticketid', checkAuth, checkRole(config.ROLE.TECHNICIAN_INTERNAL), TicketControllers.updatestatusRequesteeTicket)

// open ticket
routers.patch('/acceptTicket/:ticketid', checkAuth, checkRole(config.ROLE.TECHNICIAN_INTERNAL), technicianControllers.ticketAccept)

// get location
routers.get('/getAssetLocation',checkAuth,checkRole(config.ROLE.TECHNICIAN_INTERNAL), TicketControllers.getAssetLocation)
module.exports = routers;