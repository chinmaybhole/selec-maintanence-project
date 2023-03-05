//  Add Requestee Logic here
const { findUser } = require("../Middleware/checkAuth.middleware");

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const username = req.valid.username; // data retrived from token
    const user = await findUser(username);
    console.log(user);

    // user.id of who created the ticket
    req.body.requestee_id = user._id;

    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = { getCurrentUser };
