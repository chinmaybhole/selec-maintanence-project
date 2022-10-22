const express = require('express')
const routers = express.Router();
const adminControllers = require('../Controllers/admin.controllers')
const config = require('../Config/config.json')
const { checkAuth, checkRole } = require('../Middleware/checkAuth.middleware')
const TicketControllers = require('../Controllers/ticket.controllers')

//////////////////////////////////////////////////// User Section ///////////////////////////////////////////////////

// Get one/all user/s
routers.get('/', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getUsers)

// Add user
routers.post('/add_user', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addUser)

// Update user
routers.put('/update_user/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.updateUser)

// Delete User
routers.delete('/delete_user/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.deleteUser)

//////////////////////////////////////////////////// Role Section ////////////////////////////////////////////////////

// Add role
routers.post('/add_role', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addRole)

// Get all roles
routers.get('/roles', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getRoles)

// Delete role
routers.delete('/delete_role/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.deleteRole)

//////////////////////////////////////////////////// Asset Section ///////////////////////////////////////////////////

// Get all assets
routers.get('/assets', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getAsset)

// Add asset
routers.post('/add_assets', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addAsset)

// Delete asset
routers.delete('/delete_asset/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.deleteAsset)

//////////////////////////////////////////////////// Asset Category Section //////////////////////////////////////////

// Add asset category
routers.post('/add_assetCategory', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addAssetCategory)

// get all asset category
routers.get('/assetCategory', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getAssetCategory)

// update asset category
routers.put('/update_assetCategory/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.updateAssetCategory)

// delete asset category
routers.delete('/delete_assetCategory/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.deleteAssetCategory)

//////////////////////////////////////////////////// Machinary Section ///////////////////////////////////////////////

// get all machinedata
routers.get('/machineData', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getMachine)

// add machinedata
routers.post("/add_machineData", checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addMachine)

// delete machinedata
routers.delete("/delete_machineData/:id", checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.deleteMachine)

// update machinedata
routers.put('/update_machineData/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.updateMachine)

//////////////////////////////////////////////////// Schedular Section ///////////////////////////////////////////////

// get schedular
routers.get('/schedular', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getSchedular)

// get one schedule
routers.get('/scheular/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getOneSchedule)

// add schedular
routers.post('/add_schedular', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addSchedular)

// update schedular
routers.put('/update_schedular/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.updateSchedular)

// delete schedular
routers.delete('/delete_schedular/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.deleteSchedular)

//////////////////////////////////////////////////// Location Section ////////////////////////////////////////////////

// add location
routers.post('/add_location', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addLocation)

// get location
routers.get('/locations', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getLocation)

// update location
routers.put('/update_location/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.updateLocation)

// delete location
routers.delete('/delete_location/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.deleteLocation)

//////////////////////////////////////////////////// Ticket Section ///////////////////////////////////////////////

// get tickets
routers.get('/ticket', checkAuth, checkRole(config.ROLE.ADMIN), TicketControllers.getTickets)

// get one ticket
routers.get('/ticket/:ticketid', checkAuth, checkRole(config.ROLE.ADMIN), TicketControllers.getOneTicket)

// add ticket
routers.post('/add_ticket', checkAuth, checkRole(config.ROLE.ADMIN), TicketControllers.addRequesteeTicket)

// update ticket
routers.put('/ticket/:ticketid', checkAuth, checkRole(config.ROLE.ADMIN), TicketControllers.updateRequesteeTicket)

// close ticket
routers.patch('/ticket/:ticketid', checkAuth, checkRole(config.ROLE.ADMIN), TicketControllers.updatestatusRequesteeTicket)

// delete ticket
routers.delete('/ticket/:ticketid', checkAuth, checkRole(config.ROLE.ADMIN), TicketControllers.deleteRequesteeTicket)

//////////////////////////////////////////////////// Checklist Section ///////////////////////////////////////////////

// get checklists
routers.get('/checklist', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getChecklist)

// get one checklist
routers.get('/checklist/:id', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.getOneChecklist)

// add checklist
routers.post('/add_checklist', checkAuth, checkRole(config.ROLE.ADMIN), adminControllers.addChecklist)

module.exports = routers;
