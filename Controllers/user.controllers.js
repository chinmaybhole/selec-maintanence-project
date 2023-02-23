const bcrypt = require('bcrypt')
const { generateToken } = require('../Middleware/jsonToken.middleware')
const {findUser, getLoginRole, getInterface} = require('../Middleware/checkAuth.middleware')

const login = async(req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
        let user = await findUser(username) // Authentication 
        if (user) {
            let role = await getLoginRole(user) // Authorisation
            const compare = await bcrypt.compare(password, user.password)
            if (compare) {
                if (role !== null) {
                    let interface = getInterface(user)
                    if (interface !== null){
                        let token = generateToken(user.username, role, interface)
                        res.status(201).json({ access_token: token, role: role });
                    }
                    return res.status(404).json({ error: interface })
                }
                return res.status(404).json({ error: role })
            }
            return res.status(400).json({ msg: 'incorrect password' });
        }
        return res.status(404).json({ error: "Username not found" })

    } catch (err) {
        return new Error(err)
    }

}

module.exports = { login }