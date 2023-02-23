const { validateToken } = require('../Middleware/jsonToken.middleware')
const { User, Role } = require('../Models/users.model')
const config = require('../Config/config.json')

function checkRole(role) {
    return (req, res, next) => {
        
        if (req.valid) {
            try {
                let tokenRole = req.valid.role
                if (tokenRole === role) {
                    req.valid.username 
                    next();
                }
                else {
                    res.status(401).json({ msg: 'You are not a authorized user' })
                }
            } catch (error) {
                res.status(401).json({ error: error.message })
            }

        } else {
            res.status(404).json({ msg: 'Token Data Not Found' })
        }

    }

}

async function findUser(username) {
    try {
        let user = await User.findOne({ "username": {$regex: username} })
        if (user)
            if (user.username === username) return user

    } catch (err) {
        throw new Error(err.message)
    }
}

async function getLoginRole(user) {
    if (user) {
        let role = await Role.find({_id: user.role})
        //TODO Test case user with multiple role 
        role = role[0]

        if (role.name === config.ROLE.REQUESTEE) return config.ROLE.REQUESTEE
        if (role.name === config.ROLE.DEPARTMENT_HEAD) return config.ROLE.DEPARTMENT_HEAD
        if (role.name === config.ROLE.ADMIN) return config.ROLE.ADMIN
        if (role.name === config.ROLE.DESIGN) return config.ROLE.DESIGN
        if (role.name === config.ROLE.MANAGEMENT) return config.ROLE.MANAGEMENT
        if (role.name === config.ROLE.TECHNICIAN_EXTERNAL) return config.ROLE.TECHNICIAN_EXTERNAL
        if (role.name === config.ROLE.TECHNICIAN_INTERNAL) return config.ROLE.TECHNICIAN_INTERNAL
    }
    return new Error("Role Not Found")
}

function getInterface(user){
    try {
        if (user){
            // TODO test case user with multiple interface
            let interface = user.interface
            if(interface === config.INTERFACE.APP) return config.INTERFACE.APP
            if(interface === config.INTERFACE.EMAIL) return config.INTERFACE.EMAIL
            if(interface === config.INTERFACE.WEBAPP) return config.INTERFACE.WEBAPP
        }
        return new Error("Interface Not Found")
    } catch (error) {
        return new Error(error)
    }
}

function checkAuth(req, res, next) {
    const token = req.header('access-token')
    if (token) {
        try {
            const validate = validateToken(token)
            if (validate) {
                req.valid = validate
                next();
            }
        } catch (error) {
            res.status(401).json({ error: error.message })
        }

    } else {
        return res.status(403).json("Need to login!")
    }

}

module.exports = { checkAuth, checkRole, findUser, getLoginRole, getInterface }