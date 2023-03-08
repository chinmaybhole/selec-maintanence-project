const express = require("express");
const routers = express.Router();
const config = require("../Config/config.json");
const { checkAuth, checkRole } = require("../Middleware/checkAuth.middleware");
const requesteeControllers = require("../Controllers/requestee.controllers");
const TicketControllers = require("../Controllers/ticket.controllers");

//////////////////////////////////////////////////// Ticket Section ////////////////////////////////////////////////////

// get all tickets
routers.get(
  "/ticket",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  TicketControllers.getRequesteeTickets
);

// get one ticket
routers.get(
  "/ticket/:ticketid",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  TicketControllers.getRequesteeOneTicket
);

// add ticket
routers.post(
  "/add_ticket",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  TicketControllers.addRequesteeTicket
);

// update ticket
routers.put(
  "/ticket/:ticketid",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  TicketControllers.updateRequesteeTicket
);

// close ticket
routers.patch(
  "/ticket/:ticketid",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  TicketControllers.updatestatusRequesteeTicket
);

// delete ticket
routers.delete(
  "/ticket/:ticketid",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  TicketControllers.deleteRequesteeTicket
);

// get asset location
routers.get(
  "/getAssetLocation",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  TicketControllers.getAssetLocation
);

// get Current User
routers.get(
  "/user",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  requesteeControllers.getCurrentUser
);

routers.get(
  "/location",
  checkAuth,
  checkRole(config.ROLE.REQUESTEE),
  requesteeControllers.getLocation
);
module.exports = routers;
