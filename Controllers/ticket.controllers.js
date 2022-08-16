const { Ticket } = require('../Models/ticket.models')
const { findUser } = require('../Middleware/checkAuth.middleware')
const { Asset } = require('../Models/assets.model')

// TODO Create 2 seprate tickets Trouble ticket and Schedular Ticket

//////////////////////////////////////////////////// Admin Section ////////////////////////////////////////////////////

// get tickets
const getTickets = async(req,res)=>{
    try {
        if(req.query.subject){
            const ticket = await Ticket.find({ subject: { $regex: req.query.subject }}).populate("asset_name").exec()
            if (!ticket) return res.status(404).json({msg:"no tickets found"})
            return res.status(200).json({ticket:ticket})
        }

        if(req.query.client_id){
            const ticket = await Ticket.find({ client_id: req.query.client_id}).populate("asset_name").exec()
            const total = ticket.length
            if (total === 0) return res.status(404).json({msg:"no tickets found"})
            return res.status(200).json({tickets:ticket,totalcount:total})

        }

        if(req.query.status){
            const ticket = await Ticket.find({status : {$regex: req.query.status}}).populate("asset_name").exec()
            const total = ticket.length
            if (total === 0) return res.status(404).json({msg:"no tickets found"})
            return res.status(200).json({tickets:ticket,totalcount:total})
        }

        if(req.query.client_id && req.query.subject){
            const ticket = await Ticket.find({ client_id: client_id, subject: { $regex: req.query.subject }}).populate("asset_name").exec()
            if (!ticket) return res.status(404).json({msg:"no tickets found"})
            return res.status(200).json({ticket:ticket})
        }
        const tickets = await Ticket.find({}).populate("asset_name").exec()
        const total = tickets.length
        if (total === 0) return res.status(404).json({msg:"no tickets found"})

        return res.status(200).json({tickets:tickets,totalcount:total})
    } catch (error) {
        return new Error(error)
    }
}

// get one ticket
const getOneTicket = async(req,res) => {
    try {
        const ticketid = req.params.ticketid
        if(ticketid != null){
            const ticket = await Ticket.findOne({_id: ticketid})
            if (!ticket) return res.status(404).json({msg:"no tickets found"})
    
            return res.status(200).json({ticket:ticket})
        }
        else{
            return res.status(400).json({msg:"ticketId cannot be empty"})
        }

    } catch (error) {
        return new Error(error)
    }
}

// close tickets
const updatestatusTicket = async(req,res) => {}

//////////////////////////////////////////////////// Requestee Section ////////////////////////////////////////////////////

// get tickets
const getRequesteeTickets = async(req,res) => {
    try {
        const username = req.valid.username  // data retrived from token
        const user = await findUser(username)
        const userid = user._id

        if(req.query.subject){
            const ticket = await Ticket.find({client_id: userid, subject: { $regex: req.query.subject }})
            if (ticket.length === 0) return res.status(404).json({msg:"no tickets found"})
            return res.status(200).json({data:ticket})
        }
        const tickets = await Ticket.find({client_id: userid}).populate("asset_name").exec()
        const total = tickets.length
        if (total === 0) return res.status(404).json({msg:"no tickets found"})

        return res.status(200).json({tickets:tickets,totalcount:total})
    } catch (error) {
        return new Error(error)
    }
}

// get one ticket
const getRequesteeOneTicket = async(req,res) => {
    try {
        const username = req.valid.username  // data retrived from token
        const user = await findUser(username)
        const userid = user._id
        const ticketid = req.params.ticketid

        const ticket = await Ticket.findOne({_id: ticketid, client_id: userid})
        if (ticket.length === null) return res.status(404).json({msg:"no tickets found"})

        return res.status(200).json({ticket:ticket})
    } catch (error) {
        return new Error(error)
    }
}

// add ticket
const addRequesteeTicket = async(req,res) => {
    try {
        const username = req.valid.username  // data retrived from token
        const user = await findUser(username)

        req.body.client_id = user._id
        req.body.ticket_type = "trouble"

        if(req.body.asset_name){
            const assetid = await Asset.find({asset_name: req.body.asset_name})
            req.body.asset_name = assetid[0]
        }

        const newTicket = new Ticket(req.body)
        const ticketData = await newTicket.save()
        if (ticketData === null) return res.status(501).json({msg:"unable to create ticket, try again"})
        return res.status(201).json({msg: "ticket created successfully"})
    } catch (error) {
        return new Error({error:error})
    }
}

// update ticket
const updateRequesteeTicket = async(req,res) => {
    // TODO rework on update logic
    try {
        
        await Ticket.findOneAndUpdate({_id: req.params.id},req.body,{new:true},(err,result) => {
            if(err) return res.status(400).json({msg:"an error occured, try again"})
            if(result) return res.status(200).json({msg:"ticket has been updated"})
            return res.status(404).json({msg: "Ticket not found"})
        })
    } catch (error) {
        return new Error(error)
    }
}

// close ticket
const updatestatusRequesteeTicket = async(req,res) => {
    try {
        const id = req.params.ticketid
        
        if(req.body.status === "escalate") req.body.escalated = "open";

        const updateTicket = await Ticket.findOneAndUpdate({_id: id}, req.body ,{new:true})

        if (updateTicket){
            await updateTicket.save()
            return res.status(200).json({msg:"ticket has been updated"})
        }else{
            return res.status(400).json({msg:"an error occured, try again"})
        }
    } catch (error) {
        return new Error(error)
    }
}

// delete ticket
const deleteRequesteeTicket = async(req,res) => {
    try {
        if(req.params.ticketid){
            await Ticket.findByIdAndDelete({_id: req.params.ticketid}, (err,result) => {
                if(err) return res.status(400).json({mes:"an error occured, try again"})
                if(result) return res.status(200).json({msg: "ticket Deleted Successfully"})
                return res.status(404).json({msg: "ticket not found"})
            })
        }
        return res.status(400).json({msg: "ticket id cannot be null"})
    } catch (error) {
        return new Error(error)
    }
}

module.exports= {getTickets, getOneTicket, updatestatusTicket, getRequesteeTickets, getRequesteeOneTicket, addRequesteeTicket, updateRequesteeTicket, updatestatusRequesteeTicket, deleteRequesteeTicket}