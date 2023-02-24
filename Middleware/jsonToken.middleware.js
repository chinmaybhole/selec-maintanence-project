require('dotenv').config();
const jwt = require('jsonwebtoken');
const config = require('../Config/config.json')

// Generate JWT Token
function generateToken(username, role, interface) {
    try {
        let jwtsecretkey = config.Jwt.JWT_SECRET_KEY;
        let data = {
            username: username,
            role: role,
            interface: interface
        }
        return token = jwt.sign(data, jwtsecretkey, { expiresIn: config.Jwt.access_expires })
    } catch (err) {
        console.log(err);
    }
}
//Validate JWT Token
function validateToken(token) {
    let jwtSecretKey = config.Jwt.JWT_SECRET_KEY;

    if (token) {
        try {
            const verified = jwt.verify(token, jwtSecretKey);
            return verified;

        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)
        }

    } else {
        return "Token not found"
    }

}

// function decodeToken(token) {
//     try {
//         let decode = jwt.decode(token)
//         return decode
//     } catch (error) {
//         throw new Error(error.message)

//     }



// }

module.exports = { generateToken, validateToken }