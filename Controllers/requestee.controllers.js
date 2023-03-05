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

const getLocation = async (req, res) => {
  try {
    // pagination parameters
    const { page = 1, limit = 9 } = req.query;

    if (req.query) {
      let status = req.query.status;
      let city = req.query.city;

      if (status && city) {
        const getlocationbystatusandcity = await Location.find({
          status: { $regex: status },
          city: { $regex: city },
        })
          .populate("subdivision.rooms.assets", "model_name")
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
        const gettotalcount = getlocationbystatusandcity.length;
        return res
          .status(200)
          .json({ locations: getlocationbystatusandcity, total: gettotalcount })
          .end();
      }
      if (status) {
        const getlocationbystatus = await Location.find({
          status: { $regex: status },
        })
          .populate("subdivision.rooms.assets", "model_name")
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
        const totalstatuscount = getlocationbystatus.length;
        return res
          .status(200)
          .json({ status: getlocationbystatus, total: totalstatuscount })
          .end();
      }
      if (city) {
        const getlocationbycity = await Location.find({
          city: { $regex: city },
        })
          .populate("subdivision.rooms.assets", "model_name")
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
        const totalcitycount = getlocationbycity.length;
        return res
          .status(200)
          .json({ cities: getlocationbycity, total: totalcitycount })
          .end();
      }
    }

    const getlocations = await Location.find({})
      .populate("subdivision.rooms.assets", "asset_name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const totalcount = await Location.count({});
    if (totalcount === 0)
      return res.status(404).json({ message: "no locations found" });
    res.status(200).json({ locations: getlocations, total: totalcount });
  } catch (error) {}
};

module.exports = { getCurrentUser, getLocation };
