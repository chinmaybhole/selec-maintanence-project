const { Ticket } = require('../Models/ticket.models')
const { findUser } = require('../Middleware/checkAuth.middleware')
const { Asset } = require('../Models/assets.model')
const { checklist } = require('../Models/checklist.model')
const { Location } = require('../Models/location.model')
const utils = require('../Utils/common.utils')

// TODO Create 2 seprate tickets Trouble ticket and Schedular Ticket

//////////////////////////////////////////////////// Admin Section ////////////////////////////////////////////////////

// get tickets
const getTickets = async (req, res) => {
    try {
        if (req.query.subject) {
            const ticket = await Ticket.find({ subject: { $regex: req.query.subject } }).populate("asset_name").exec()
            if (!ticket) return res.status(404).json({ msg: "no tickets found" })
            return res.status(200).json({ ticket: ticket })
        }

        if (req.query.requestee_id) {
            const ticket = await Ticket.find({ requestee_id: req.query.requestee_id }).populate("asset_name").exec()
            const total = ticket.length
            if (total === 0) return res.status(404).json({ msg: "no tickets found" })
            return res.status(200).json({ tickets: ticket, totalcount: total })

        }

        if (req.query.status) {
            const ticket = await Ticket.find({ status: { $regex: req.query.status } }).populate("asset_name").exec()
            const total = ticket.length
            if (total === 0) return res.status(404).json({ msg: "no tickets found" })
            return res.status(200).json({ tickets: ticket, totalcount: total })
        }

        if (req.query.requestee_id && req.query.subject) {
            const ticket = await Ticket.find({ requestee_id: requestee_id, subject: { $regex: req.query.subject } }).populate("asset_name").exec()
            if (!ticket) return res.status(404).json({ msg: "no tickets found" })
            return res.status(200).json({ ticket: ticket })
        }
        const tickets = await Ticket.find({}).populate("asset_name").exec()
        const total = tickets.length
        if (total === 0) return res.status(404).json({ msg: "no tickets found" })

        return res.status(200).json({ tickets: tickets, totalcount: total })
    } catch (error) {
        return new Error(error)
    }
}

// get one ticket
const getOneTicket = async (req, res) => {
    try {
        const ticketid = req.params.ticketid
        if (ticketid != null) {
            const ticket = await Ticket.findOne({ _id: ticketid }).populate("asset_name").exec()
            if (!ticket) return res.status(404).json({ msg: "no tickets found" })

            return res.status(200).json({ ticket: ticket })
        }
        else {
            return res.status(400).json({ msg: "ticketId cannot be empty" })
        }

    } catch (error) {
        return new Error(error)
    }
}

// close tickets
const updatestatusTicket = async (req, res) => { }


//////////////////////////////////////////////////// Requestee Section ////////////////////////////////////////////////////

// get tickets
const getRequesteeTickets = async (req, res) => {
    try {
        const username = req.valid.username  // data retrived from token
        const user = await findUser(username)
        const userid = user._id

        if (req.query.subject) {
            const ticket = await Ticket.find({ requestee_id: userid, subject: { $regex: req.query.subject } }).populate("asset_name").exec()
            if (ticket.length === 0) return res.status(404).json({ msg: "no tickets found" })
            return res.status(200).json({ data: ticket })
        }
        const tickets = await Ticket.find({ requestee_id: userid }).populate("asset_name").exec()
        const total = tickets.length
        if (total === 0) return res.status(404).json({ msg: "no tickets found" })

        return res.status(200).json({ tickets: tickets, totalcount: total })
    } catch (error) {
        return new Error(error)
    }
}

// get one ticket
const getRequesteeOneTicket = async (req, res) => {
    try {
        const username = req.valid.username  // data retrived from token
        const user = await findUser(username)
        const userid = user._id
        const ticketid = req.params.ticketid

        const ticket = await Ticket.findOne({ _id: ticketid, requestee_id: userid }).populate("asset_name").exec()
        if (ticket.length === null) return res.status(404).json({ msg: "no tickets found" })

        return res.status(200).json({ ticket: ticket })
    } catch (error) {
        return new Error(error)
    }
}

// add ticket
const addRequesteeTicket = async (req, res) => {
    try {

        const username = req.valid.username  // data retrived from token
        const user = await findUser(username)

        // user.id of who created the ticket
        req.body.requestee_id = user._id

        // ticket type trouble because default = schedule
        req.body.ticket_type = 'trouble'

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const newTicket = new Ticket(req.body)
        newTicket.save((err, result) => {
            if (err) {
                console.log(err)
                return res.status(501).json({ msg: "unable to create ticket, try again" })
            }
            if (!err) {
                return res.status(201).json({ msg: "ticket created successfully" })
            }
        })

    } catch (error) {
        return new Error({ error: error })
    }
}

// add schedular ticket
const addSchedularTicket = async (req, res, asset_id, checklist, location) => {
    try {

        // const username = req.valid.username  // data retrived from token
        // const user = await findUser(username)

        // // user.id of who created the ticket
        // req.body.requestee_id = user._id

        // check previous assets schedule tickets and set status close if any open
        await Ticket.findOneAndUpdate({ asset_name: asset_id, status: "open", ticket_type: "schdule" }, { $push: { status: "close" } }, { new: true })

        // monthly maintenance suject
        req.body = {
            subject: 'asset maintenance',
            description: 'regular maintenance',
            checklist: checklist,
            asset_name: asset_id,
            location: location
        }

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const newTicket = new Ticket(req.body)
        let sendTicket = await newTicket.save()
        if (!sendTicket) return sendTicket
        if (sendTicket) return sendTicket


    } catch (error) {
        return new Error({ error: error })
    }
}

// update ticket
const updateRequesteeTicket = async (req, res) => {
    // TODO rework on update logic
    try {

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        await Ticket.findOneAndUpdate({ _id: req.params.ticketid }, req.body, { new: true }, (err, result) => {
            if (err) return res.status(400).json({ msg: "an error occured, try again" })
            if (result) return res.status(200).json({ msg: "ticket has been updated" })
            return res.status(404).json({ msg: "Ticket not found" })
        })
    } catch (error) {
        return new Error(error)
    }
}

// close ticket
const updatestatusRequesteeTicket = async (req, res) => {
    try {
        const id = req.params.ticketid
        if (req.body.status === "escalate") req.body.escalated = "open";

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const updateTicket = await Ticket.findByIdAndUpdate({ _id: req.params.ticketid }, req.body, { new: true })
        if (updateTicket) {
            await updateTicket.save()
        } else {
            return res.status(400).json({ msg: "an error occured, try again" })
        }
    } catch (error) {
        return new Error(error)
    }
}

// delete ticket
const deleteRequesteeTicket = async (req, res) => {
    try {
        if (req.params.ticketid) {
            await Ticket.findByIdAndDelete({ _id: req.params.ticketid }, (err, result) => {
                if (err) return res.status(400).json({ mes: "an error occured, try again" })
                if (result) return res.status(200).json({ msg: "ticket Deleted Successfully" })
                return res.status(404).json({ msg: "ticket not found" })
            })
        }
        return res.status(400).json({ msg: "ticket id cannot be null" })
    } catch (error) {
        return new Error(error)
    }
}

module.exports = { getTickets, getOneTicket, updatestatusTicket, getRequesteeTickets, getRequesteeOneTicket, addRequesteeTicket, updateRequesteeTicket, updatestatusRequesteeTicket, deleteRequesteeTicket, addSchedularTicket }