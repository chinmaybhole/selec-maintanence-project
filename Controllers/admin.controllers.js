const { User, Role } = require('../Models/users.model')
const { Asset, assetsconfig } = require('../Models/assets.model')
const { machinedata } = require('../Models/machinedata.model')
const { Location } = require('../Models/location.model')
const { Schedular } = require('../Models/schedular.model')
const { checklist, tasklist } = require('../Models/checklist.model')
const { getLength, checkReduncancy } = require('../Helper/admin.helper')
const { addSchedularTicket } = require('../Controllers/ticket.controllers')
const { crongen } = require('../Utils/crongen.utils')
const utils = require('../Utils/common.utils')
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../Congif/.env' });
let MongoClient = require("mongodb").MongoClient;
//////////////////////////////////////////////////// User Section ////////////////////////////////////////////////////

// get all users 
const getUsers = async (req, res) => {
    try {
        // pagination parameters
        const { page = 1, limit = 9 } = req.query

        let keys = req.query.user_id
        if (keys) {
            const user = await User.findOne({ user_id: keys }).populate('role', 'name').populate('asset_category', 'asset_category').populate('skills', 'asset_name').exec()
            if (user === null) return res.status(404).json({ msg: "No user Found" })
            return res.send(user)
        }
        let role = req.query.role
        if (role) {
            const roleid = await Role.find({ name: role })
            role = roleid[0]._id.toString()
            const userrole = await User.find({ "role": role }).populate('role', 'name').populate('asset_category', 'asset_category').populate('skills', 'asset_name').limit(limit * 1).skip((page - 1) * limit).exec()
            const total = userrole.length;
            if (userrole === null) return res.status(404).json({ msg: `No user with role: ${role} was found` })
            return res.status(200).send({ users: userrole, total: total })
        }
        const users = await User.find({}).populate('role', 'name').populate('asset_category', 'asset_category').populate('skills', 'asset_name').limit(limit * 1).skip((page - 1) * limit).exec();
        const total = await User.count({});
        if (users.length == 0) return res.status(404).json({ msg: "No users Found" })

        return res.send({ users: users, total: total })

    } catch (err) {
        return res.status(500).json({ msg: err })
    }
}

//  add new user
const addUser = async (req, res) => {
    try {

        if (req.body.role) {
            req.body.role = await Role.find({ name: req.body.role })
            req.body.role = req.body.role[0]
        }

        if (req.body.asset_category) {
            category = req.body.asset_category
            if (category.length >= 2) {
                let data = []
                for (let i in category) {
                    categories = await assetsconfig.find({ asset_name: req.body.asset_category[i] })
                    data.push(categories[0])
                }
                req.body.asset_category = data
            }
            Adata = await assetsconfig.find({ asset_category: req.body.asset_category })
            req.body.asset_category = Adata[0]
        }

        if (req.body.skills) {
            techskills = req.body.skills
            if (techskills.length >= 2) {
                let data = []
                for (let i in techskills) {
                    skills = await Asset.find({ asset_name: req.body.skills[i] })
                    data.push(skills[0])
                }
                req.body.skills = data
            } else {
                skills = await Asset.find({ asset_name: req.body.skills })
                req.body.skills = skills[0]
            }

        }

        // if (req.body.location) {
        //     let addlocation = await Location.find({})
        // }

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const newUser = new User(req.body)
        const saltRounds = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, saltRounds)

        newUser.save(async (err, result) => {
            if (!err) {
                return res.status(201).json({ msg: "user created successfully" });
            }
            if (err) {
                return res.status(501).json({ msg: "an error occured, try again" });
            }
        });
    } catch (error) {
        res.json({ err: error });
    }
}

// Update user
const updateUser = async (req, res) => {
    try {
        if (req.body) {
            if (req.body.role) {
                req.body.role = await Role.find({ name: req.body.role })
                req.body.role = req.body.role[0]
            }

            if (req.body.asset_category) {
                let assetCategory = req.body.asset_category
                let category = []
                let Adata
                if (assetCategory >= 2) {
                    const oldcategorydata = await User.find({ _id: req.params.id })
                    const oldcategorydatas = oldcategorydata[0].asset_category

                    if (oldcategorydatas.length >= 2) {
                        for (let i in oldcategorydatas) {
                            const Cdata = await assetsconfig.find({ _id: oldcategorydatas[i] })
                            category.push(Cdata[0])
                        }
                    } else {
                        const Cdata = await assetsconfig.find({ _id: oldcategorydatas })
                        category.push(Cdata[0])
                    }

                    // checks the largest length amongest old and new data array
                    let { length, obj } = getLength(category, assetCategory, "assetCategory")

                    // checks for redundant value and returns nonsimilardata values
                    let { nonsimilardata } = checkReduncancy(length, obj, assetCategory)

                    if (nonsimilardata !== undefined) {
                        let data = []
                        for (let i in nonsimilardata) {
                            config = await assetsconfig.find({ asset_name: nonsimilardata[i] })
                            data.push(config[0])
                        }
                        req.body.asset_category = data
                    } else {
                        req.body.asset_category = ""
                    }
                }
                Adata = await assetsconfig.find({ asset_category: req.body.asset_category })
                req.body.asset_category = Adata[0]
            }

            if (req.body.skills) {
                let techskills = req.body.skills
                let skills = []
                if (techskills.length >= 2) {
                    const oldUserSkill = await User.find({ _id: req.params.id })
                    const oldUserSkills = oldUserSkill[0].skills

                    if (oldUserSkills.length >= 2) {
                        for (let i in oldUserSkills) {
                            const Sdata = await Asset.find({ _id: oldUserSkills[i] })
                            skills.push(Sdata[0])
                        }
                    } else {
                        const Sdata = await Asset.find({ _id: oldUserSkills })
                        skills.push(Sdata[0])
                    }

                    // checks the largest length amongest old and new data array
                    let { length, obj } = getLength(skills, techskills)

                    // checks for redundant value and returns nonsimilardata values
                    let nonsimilardata = checkReduncancy(length, obj, techskills)

                    if (nonsimilardata !== undefined) {
                        let data = []
                        for (let i in nonsimilardata) {
                            skills = await Asset.find({ asset_name: nonsimilardata[i] })
                            data.push(skills[0])
                        }
                        req.body.skills = data
                        // console.log(data)
                    } else {
                        req.body.skills = ""
                    }

                } else {
                    skills = await Asset.find({ asset_name: req.body.skills })
                    req.body.skills = skills[0]
                    console.log(req.body.skills)

                }

            }

            const updateuser = await User.findByIdAndUpdate({ _id: req.params.id }, {
                $push: {
                    "username": req.body.username,
                    "password": req.body.password,
                    "first_name": req.body.first_name,
                    "middle_name": req.body.middle_name,
                    "last_name": req.body.last_name,
                    "mobile_phone": req.body.mobile_phone,
                    "email_id": req.body.email_id,
                    "company_name": req.body.company_name,
                    "role": req.body.role,
                    "note": req.body.note,
                    "interfaces": req.body.interfaces,
                    "asset_category": req.body.asset_category,
                    "skills": req.body.skills
                }
            }, { new: true })

            // convert any upper case letters to lower before sending to database
            req.body = utils.lowercasedata(req.body)

            const up = await updateuser.save((err, result) => {
                if (!err) {
                    return res.status(200).json({ msg: "user updated successfully" });
                }
                if (err) {
                    return res.status(501).json({ msg: "an error occured, try again" });
                }
            });
        }
        return new Error({ error: "update fields cannot be empty" })


    } catch (error) {
        return new Error(error.message)

    }

}

// Delete user
const deleteUser = async (req, res) => {
    try {
        // await User.deleteOne({_id:req.params.id})
        await User.findByIdAndDelete({ "_id": req.params.id }, (err, result) => {
            if (result) {
                return res.status(200).json({ "message": "user deleted successfully" })
            }
            if (err) {
                return res.status(403).json(err)
            }
            return res.status(403).json({ "message": "user not found" })
        })


    } catch (error) {
        return new Error(error)
    }
}

//////////////////////////////////////////////////// Role Section ////////////////////////////////////////////////////

// add new role
const addRole = async (req, res) => {
    try {
        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const newRole = new Role(req.body)
        newRole.save((err, result) => {
            if (!err) {
                return res.status(201).json({ msg: "role created successfully" });
            }
            if (err) {
                return res.status(501).json({ msg: "an error occured, try again" });
            }
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

// get all roles
const getRoles = async (req, res) => {
    const roles = await Role.find({})
    try {
        if (roles.length == 0) return res.status(404).json({ msg: "No roles Found" })

        return res.status(200).json(roles);
    } catch (error) {
        res.json({ message: error });
    }
}

// delete role
const deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndDelete({ "_id": req.params.id }, (err, result) => {
            if (result) {
                return res.status(200).json({ "message": "role deleted successfully" })
            }
            if (err) {
                return res.status(403).json(err)
            }
            return res.status(404).json({ "message": "role not found" })
        })

    } catch (error) {
        return new Error(error)
    }
}

//////////////////////////////////////////////////// Asset Section ///////////////////////////////////////////////////

// get one/all asset/s
const getAsset = async (req, res) => {
    try {
        // pagination parameters
        const { page = 1, limit = 9 } = req.query

        const getassets = await Asset.find({}).limit(limit * 1).skip((page - 1) * limit).exec()
        if (getassets.length == 0) return res.status(404).json({ msg: "No assets Found" })

        return res.status(200).json(getassets)
    } catch (error) {
        console.log(error)
        res.json({ message: error.message });
    }
}

// add asset
const addAsset = async (req, res) => {
    try {

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const newAasset = new Asset(req.body)
        newAasset.save(async (err, result) => {
            if (!err) {

                const updatelocation = await Location.findOneAndUpdate({
                    // elemMatch matches the given value within the provided key inside the document
                    "subdivision": { "$elemMatch": { room: req.body.asset_location.room } },
                    unit_or_building: req.body.asset_location.unit_building,
                }, {
                    $push: {
                        // values added dynamically to $ from arrayFilters
                        "subdivision.$[outer].rooms.$[inner].assets": result
                    }
                }, {
                    arrayFilters: [
                        {
                            "outer.floor": req.body.asset_location.floor
                        },
                        {
                            "inner.room": req.body.asset_location.room
                        }
                    ],
                    new: true
                })

                if (updatelocation) {
                    updatelocation.save((err, result) => {
                        if (!err) {
                            return res.status(201).json({ msg: "asset added successfully" });
                        }
                        if (err) {
                            return res.status(501).json({ msg: "an error occured while updating location, try again" });
                        }
                    })
                }
            }
            if (err) {
                return res.status(501).json({ err: err });
            }
        });

    } catch (error) {
        res.json({ message: error.message });
    }
}

// delete asset
const deleteAsset = async (req, res) => {
    try {
        await Asset.findByIdAndDelete({ "_id": req.params.id }, (err, result) => {
            if (result) {
                return res.status(200).json({ "message": "asset deleted successfully" })
            }
            if (err) {
                return res.status(403).json(err)
            }
            return res.status(404).json({ "message": "asset not found" })
        })
    } catch (error) {
        return new Error(error)
    }
}

// add multiple asset
const addMultipleAsset = async (req, res) => {
    try {


        Asset.insertMany([], (err, result) => {
            if (!err) {
                return res.status(201).json({ msg: "assets added succssfully" })
            }
            if (err) {
                return res.status(501).json({ err: "en error occured while adding assets, try again" })
            }
        })
    } catch (error) {
        res.status(501).json(new Error({ err: error }))
    }
}

//////////////////////////////////////////////////// Asset Category Section //////////////////////////////////////////

// add asset category
const addAssetCategory = async (req, res) => {
    try {
        let udata = []

        if (req.body.asset_list) {
            for (let i = 0; i < req.body.asset_list.length; i++) {
                const updateasset = await Asset.find({ asset_name: req.body.asset_list[i] })
                udata.push(updateasset[0])
            }
            req.body.asset_list = udata
        }

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const addassetcategory = new assetsconfig(req.body)
        addassetcategory.save((err, result) => {
            if (!err) {
                return res.status(201).json({ msg: "category created successfully" });
            }
            if (err) {
                return res.status(501).json({ msg: "an error occured, try again" });
            }
        })
    } catch (error) {
        res.json({ message: error.message });
    }
}

// get asset category
const getAssetCategory = async (req, res) => {
    try {
        // pagination parameters
        const { page = 1, limit = 9 } = req.query

        const keys = req.query.asset_id
        if (keys) {
            const assetdata = await assetsconfig.findOne({ asset_id: keys })
            if (assetdata === null) return res.status(404).json({ msg: "No category Found" })
            return res.send(assetdata)
        }
        const getassetcategory = await assetsconfig.find({}).populate('asset_list').limit(limit * 1).skip((page - 1) * limit).exec()
        if (getassetcategory.length == 0) return res.status(404).json({ msg: "assetcategory not found" })

        res.status(200).json(getassetcategory)
    } catch (error) {
        return new Error(error)
    }
}

// update asset category
const updateAssetCategory = async (req, res) => {
    try {
        if (req.body) {
            let udata = []
            let newdata = req.body.asset_list
            // Old asset Category data

            const oldAssetCategoryData = await assetsconfig.find({ _id: req.params.id })
            const oldAssetData = oldAssetCategoryData[0].asset_list

            // checking similar asset data in asset_list to avoid redundency 

            // checks the largest length amongest old and new data array
            let { length, obj } = getLength(oldAssetData, newdata, "assetCategory")

            // checks for redundant value and returns nonsimilardata values
            let { nonsimilardata } = checkReduncancy(length, obj, newdata)

            if (nonsimilardata !== undefined) {
                if (nonsimilardata.length > 1) {
                    for (let i in nonsimilardata) {
                        const updateasset = await Asset.find({ asset_name: nonsimilardata[i] })
                        udata.push(updateasset[0])
                    }
                    req.body.asset_list = udata
                } else {
                    const updateasset = await Asset.find({ asset_name: nonsimilardata })
                    req.body.asset_list = updateasset[0]
                }

                const updateassetcategory = await assetsconfig.findOneAndUpdate({ _id: req.params.id }, {
                    $push: {
                        "asset_category": req.body.asset_category,
                        "asset_list": req.body.asset_list
                    }
                }, { new: true })

                // convert any upper case letters to lower before sending to database
                req.body = utils.lowercasedata(req.body)

                updateassetcategory.save((err, result) => {
                    if (!err) {
                        return res.status(200).json({ msg: "category updated successfully" });
                    }
                    if (err) {
                        return res.status(501).json({ msg: "an error occured, try again" });
                    }
                });

            }
            return res.status(422).json({ msg: "asset list already exits" })
        }
        return res.status(400).json({ msg: "request body cannot be empty" })

    } catch (error) {
        return new Error(error)
    }
}

// delete asset category
const deleteAssetCategory = async (req, res) => {
    try {
        await assetsconfig.findByIdAndDelete({ '_id': req.params.id }, (err, result) => {
            if (result) {
                return res.status(200).json({ msg: "asset category deleted successfully" })
            }
            if (err) {
                return res.status(403).json(err)
            }
            return res.status(404).json(" asset category not found")
        })
    } catch (error) {
        return new Error(error)
    }
}

///////////////////////////////////////////////////// Machinary Section ////////////////////////////////////////////////

// add machine
const addMachine = async (req, res) => {
    try {
        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const newmachine = new machinedata(req.body)
        newmachine.save((err, result) => {
            if (!err) {
                return res.status(201).json({ msg: "machine created successfully" });
            }
            if (err) {
                return res.status(501).json({ msg: "an error occured, try again" });
            }
        })
    } catch (error) {
        return new Error(error)
    }
}

// get machine
const getMachine = async (req, res) => {
    try {
        // pagination parameters
        const { page = 1, limit = 9 } = req.query

        const mdata = await machinedata.find({}).limit(limit * 1).skip((page - 1) * limit).exec()
        const totalcount = await machinedata.count({})
        if (mdata.length === 0) return res.status(404).json({ message: "No machines found" })

        return res.status(200).json({ machines: mdata, total: totalcount })
    } catch (error) {
        return new Error(error)
    }
}

// delete machine
const deleteMachine = async (req, res) => {
    try {
        await machinedata.findByIdAndDelete({ _id: req.params.id }, (err, result) => {
            if (result) {
                return res.status(200).json({ message: "machine deleted successfully" })
            }
            if (err) {
                return new Error(err)
            }
            res.status(404).json({ message: "machine not found" })
        })
    } catch (error) {
        return new Error(error)
    }
}

// update machine
const updateMachine = async (req, res) => {
    try {
        if (req.params.id) {
            // convert any upper case letters to lower before sending to database
            req.body = utils.lowercasedata(req.body)

            const machineupdate = await machinedata.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
            machineupdate.save((err, result) => {
                if (!err) {
                    return res.status(200).json({ msg: "machine updated successfully" });
                }
                if (err) {
                    return res.status(501).json({ msg: "an error occured, try again" });
                }
            })
        }
        res.json({ message: "machineid is required" })
    } catch (error) {
        return new Error(error)
    }
}

//////////////////////////////////////////////////// Schedular Section ///////////////////////////////////////////////

// get schedular
const getSchedular = async (req, res) => {
    try {
        // pagination parameters
        const { page = 1, limit = 9 } = req.query

        // if (req.query.asset_category) {
        //     const schedular = await db.collection('agendaJobs').find({ asset_category: req.query.asset_category }).populate('asset_name', 'model_name').populate('checklist_selection', 'checklist_name').limit(limit * 1).skip((page - 1) * limit).exec();
        //     const total = schedular.length;

        //     if (total == 0) return res.status(404).json({ msg: "no schedules found" })

        //     res.status(200).json({ Schedules: schedular, total: total })
        // }

        let client = new MongoClient(process.env.DB_CONNECTION)
        let db = client.db('test')
        // console.log(db.collection('agendaJobs').find())
        db.collection('agendaJobs').find({}, { limit: (limit * 1), skip: ((page - 1) * limit) }).toArray((err, result) => {
            if (!err) {
                res.status(200).json({ Schedules: result, total: result.length })
            }
            if (err) {
                res.status(500).json({ msg: "An Error occured. please try again" })
            }
            if (result.length == 0) return res.status(404).json({ msg: "no schedules found" })
        })

    } catch (error) {
        return new Error(error)
    }
}

// get a schedule
const getOneSchedule = async (req, res) => {
    try {
        if (req.params.id) {
            const schedular = await Schedular.find({ _id: req.params.id });
            const total = schedular.length;

            if (total == 0) return res.status(404).json({ msg: "no schedule found" })

            res.status(200).json({ Schedule: schedular })
        }
        return res.status(400).json({ msg: "id cannot be empty" })
    } catch (error) {
        return new Error(error)
    }
}

// add schedular
const addSchedular = async (req, res) => {
    try {
        if (req.body.asset_id) {
            let assetdata = req.body.asset_id
            const checklistexists = await checklist.findOne({ checklist_name: { $regex: req.body.checklist_selection } })
            if (checklistexists) {
                if (req.body.maintainence_type && req.body.schedular && req.body.day && req.body.start_date && req.body.start_time && req.body.location) {

                    // concatinates client given info into cron (eg weekly on monday at 10:00)
                    let schedule = crongen(req.body.schedular, req.body.day, req.body.start_date, req.body.start_time)

                    // sending data to create ticket as per the following schedule
                    const { tstatus, tresult } = await addSchedularTicket(assetdata, schedule, checklistexists, req.body.location)

                    if (tstatus == 200) {
                        // data will be saved in the agenda 
                        // init()

                        return res.status(201).json({ msg: "data saved successfully" })
                    } else {
                        return res.status(500).json({ msg: "error while creating ticket. try again!" })

                    }

                } else return res.status(400).json({ msg: "must include all maintainence/schedular parameters" })

            } else return res.status(404).json({ msg: "checklist not found" })

        } else return res.status(400).json({ msg: "must include asset data" })

    } catch (error) {
        return new Error(error)
    }
}

// update schedular
const updateSchedular = async (req, res) => {
    TODO // add update schedular logic here
}

// delete schedular
const deleteSchedular = async (req, res) => {
    try {
        await Schedular.findByIdAndDelete({ _id: req.params.id }, (err, result) => {
            if (err) return new Error(err)
            if (result) return res.status(200).json({ msg: "schedular deleted successfully" })
        })
        return res.status(404).json({ msg: "schedular not found" })
    } catch (error) {
        return new Error(error)
    }
}

//////////////////////////////////////////////////// Location Section ///////////////////////////////////////////////

// add location
const addLocation = async (req, res) => {
    try {
        if (req.body.subdivision) {
            let subdivisions = req.body.subdivision
            if (subdivisions.length >= 2) {
                for (let i in subdivisions) {
                    let rooms = subdivisions[i].rooms
                    for (let j in rooms) {
                        let assets = rooms[j].assets
                        /**
                         *  Here we are passing list of assets to a map function to get the respective machine data
                            but to get machine data from database we need to apply async await to map function
                            and to avoid incomplete data or promise from map funtion we have used Promise.all() to get 
                            all the promised data first and then append it to mapdata variable 
                         */
                        if (typeof assets !== 'undefined') {
                            let mapdata = await Promise.all(assets.map(async (asset) => {
                                let data = await machinedata.find({ model_name: asset })
                                return data[0]
                            }))
                            // replacing the original data with the mapped data
                            subdivisions[i].rooms[j].assets = mapdata
                        }
                    }

                }
            } else {
                let rooms = subdivisions[0].rooms
                for (let i in rooms) {
                    let assets = rooms[i].assets
                    /**
                     *  Here we are passing list of assets to a map function to get the respective machine data
                        but to get machine data from database we need to apply async await to map function
                        and to avoid incomplete data or promise from map funtion we have used Promise.all() to get 
                        all the promised data first and then append it to mapdata variable 
                        */
                    if (typeof assets !== 'undefined') {
                        let mapdata = await Promise.all(assets.map(async (asset) => {
                            let data = await machinedata.find({ model_name: asset })
                            return data[0]
                        }))
                        // replacing the original data with the mapped data
                        subdivisions[0].rooms[i].assets = mapdata
                    }
                }
            }
        }

        // convert any upper case letters to lower before sending to database
        req.body = utils.lowercasedata(req.body)

        const newLocation = new Location(req.body)
        newLocation.save((err, result) => {
            if (!err) {
                return res.status(201).json({ msg: "location created successfully" });
            }
            if (err) {
                return res.status(501).json({ msg: "an error occured, try again" });
            }
        })
    } catch (error) {
        return new Error(error)
    }
}

// get location
const getLocation = async (req, res) => {
    try {
        // pagination parameters
        const { page = 1, limit = 9 } = req.query

        if (req.query) {
            let status = req.query.status
            let city = req.query.city

            if (status && city) {
                const getlocationbystatusandcity = await Location.find({ status: { $regex: status }, city: { $regex: city } }).populate('subdivision.rooms.assets', 'model_name').limit(limit * 1).skip((page - 1) * limit).exec()
                const gettotalcount = getlocationbystatusandcity.length
                return res.status(200).json({ locations: getlocationbystatusandcity, total: gettotalcount }).end()
            }
            if (status) {
                const getlocationbystatus = await Location.find({ status: { $regex: status } }).populate('subdivision.rooms.assets', 'model_name').limit(limit * 1).skip((page - 1) * limit).exec()
                const totalstatuscount = getlocationbystatus.length
                return res.status(200).json({ status: getlocationbystatus, total: totalstatuscount }).end()
            }
            if (city) {
                const getlocationbycity = await Location.find({ city: { $regex: city } }).populate('subdivision.rooms.assets', 'model_name').limit(limit * 1).skip((page - 1) * limit).exec()
                const totalcitycount = getlocationbycity.length
                return res.status(200).json({ cities: getlocationbycity, total: totalcitycount }).end()
            }
        }

        const getlocations = await Location.find({}).populate('subdivision.rooms.assets', 'asset_name').limit(limit * 1).skip((page - 1) * limit).exec()
        const totalcount = await Location.count({})
        if (totalcount === 0) return res.status(404).json({ message: "no locations found" })
        res.status(200).json({ locations: getlocations, total: totalcount })
    } catch (error) {

    }
}

// update location
const updateLocation = async (req, res) => {
    try {
        if (req.params.id) {

            if (req.body.subdivision) {
                let subdivisions = req.body.subdivision

                if (subdivisions.length >= 2) {
                    for (let i in subdivisions) {
                        let rooms = subdivisions[i].rooms

                        for (let j in rooms) {
                            let assets = rooms[j].assets
                            /**
                             *  Here we are passing list of assets to a map function to get the respective machine data
                                but to get machine data from database we need to apply async await to map function
                                and to avoid incomplete data or promise from map funtion we have used Promise.all() to get 
                                all the promised data first and then append it to mapdata variable 
                             */
                            if (typeof assets !== 'undefined') {
                                let mapdata = await Promise.all(assets.map(async (asset) => {
                                    let data = await machinedata.find({ model_name: asset })
                                    return data[0]
                                }))
                                // replacing the original data with the mapped data
                                subdivisions[i].rooms[j].assets = mapdata
                            }
                        }

                    }
                } else {
                    let rooms = subdivisions[0].rooms
                    for (let i in rooms) {
                        let assets = rooms[i].assets
                        /**
                         *  Here we are passing list of assets to a map function to get the respective machine data
                            but to get machine data from database we need to apply async await to map function
                            and to avoid incomplete data or promise from map funtion we have used Promise.all() to get 
                            all the promised data first and then append it to mapdata variable 
                            */
                        if (typeof assets !== 'undefined') {
                            let mapdata = await Promise.all(assets.map(async (asset) => {
                                let data = await machinedata.find({ model_name: asset })
                                return data[0]
                            }))
                            // replacing the original data with the mapped data
                            subdivisions[0].rooms[i].assets = mapdata
                        }
                    }
                }
            }
            // convert any upper case letters to lower before sending to database
            req.body = utils.lowercasedata(req.body)

            const updatelocation = await Location.findByIdAndUpdate({ _id: req.params.id }, { $push: req.body }, { new: true })
            const updatedata = await updatelocation.save((err, result) => {
                if (!err) {
                    return res.status(200).json({ msg: "location updated successfully" });
                }
                if (err) {
                    return res.status(501).json({ msg: "an error occured, try again" });
                }
            })
        }
        res.status(400).json({ message: "location id is required" })


    } catch (error) {
        return new Error(error)
    }
}

// delete location
const deleteLocation = async (req, res) => {
    try {
        await Location.findByIdAndDelete({ _id: req.params.id }, (err, result) => {
            if (result) {
                return res.status(200).json({ message: "location deleted successfully" })
            }
            if (err) {
                return new Error(err)
            }
            res.status(404).json({ message: "location not found" })
        })
    } catch (error) {
        return new Error(error)
    }
}

//////////////////////////////////////////////////// Checklist Section ///////////////////////////////////////////////

// get checklists
const getChecklist = async (req, res) => {
    try {
        // pagination parameters
        const { page = 1, limit = 9 } = req.query

        if (req.query.machine_name) {
            const getchecklist = await checklist.find({ machine_name: req.query.machine_name }).populate("machine_name", "model_name").limit(limit * 1).skip((page - 1) * limit).exec()
            const total = getchecklist.length

            if (total == 0) return res.status(404).json({ msg: "no checklist found" })

            return res.status(200).json({ checklist: getchecklist, total: total })
        }
        const getchecklist = await checklist.find({}).populate('machine_name', 'model_name').populate('task_list', 'task').limit(limit * 1).skip((page - 1) * limit).exec()
        const total = getchecklist.length

        if (total == 0) return res.status(404).json({ msg: "no checklist found" })

        return res.status(200).json({ checklist: getchecklist, total: total })

    } catch (error) {
        return new Error(error)
    }
}

// get one checklist
const getOneChecklist = async (req, res) => {
    try {
        if (req.params.id) {
            const getonechecklist = await checklist.find({ _id: req.params.id })
            const total = getonechecklist.length
            if (total == 0) return res.status(404).json({ msg: "no checklist found" })

            return res.status(200).json({ checklist: getonechecklist })
        }
        return res.status(400).json({ msg: "id cannot be empty" })
    } catch (error) {
        return new Error(error)
    }
}

// add checklist
const addChecklist = async (req, res) => {
    // TODO test this route
    try {

        //  find checklist name exists? yes then proceed further else return false
        if (req.body.checklist_name) {

            //  find machine exists? yes then proceed further else return false
            if (req.body.machine_name) {

                // find machine from machine table and replace it with req.body.machine
                const machine = await machinedata.find({ model_name: req.body.machine_name })
                if (machine.length == 0) return res.status(404).json({ msg: "machine not found" })
                req.body.machine_name = machine[0]

                // if tasklist exists in req body
                if (req.body.task_list) {
                    const newchecklist = req.body.task_list
                    const oldtasklist = await tasklist.find({})

                    // if no tasklist exists then. else ....
                    let tasks = []
                    if (oldtasklist.length == 0) {
                        for (let i in newchecklist) {
                            const newtask = new tasklist({ task: newchecklist[i] })
                            await newtask.save()

                            // store newly added tasklist's id to a list
                            tasks.push(newtask)
                        }

                        req.body.task_list = tasks

                    } else {
                        // checks the largest length amongest old and new data array
                        let { length, obj } = getLength(oldtasklist, newchecklist, "checkList")

                        // checks for redundant value and returns nonsimilardata and redendant values
                        let { nonsimilardata, similardata } = checkReduncancy(length, obj, newchecklist)

                        if (nonsimilardata.length != 0 && similardata.length != 0) {
                            // create the new tasklist if tasklist doesnot exists 
                            for (let i in nonsimilardata) {
                                const newtask = new tasklist({ task: nonsimilardata[i] })
                                await newtask.save()

                                // store newly added tasklist's id to a list
                                tasks.push(newtask)
                            }

                            // find the existing tasklist and append the tasklist's id to a list
                            for (let i in similardata) {
                                const oldtask = await tasklist.find({ task: similardata[i] })
                                tasks.push(oldtask[0])
                            }

                            // find the existing tasklist and append the tasklist's id to a list    
                        } else if (similardata) {
                            for (let i in similardata) {
                                const oldtask = await tasklist.find({ task: similardata[i] })
                                tasks.push(oldtask[0])
                            }
                        }

                        req.body.task_list = tasks
                    }

                }

                // convert any upper case letters to lower before sending to database
                req.body = utils.lowercasedata(req.body)

                // finally create the checklist and save
                const newchecklist = new checklist(req.body)
                // add checklist id to new tasklist after saving the checklist data 
                newchecklist.save(async (err, result) => {
                    if (!err) {

                        // post save opration
                        // update checklist_id attribute of tasklist after saving new checklist
                        let checklistid = result._id

                        for (let i in result.task_list) {
                            const updatetasklist = await tasklist.findByIdAndUpdate({ _id: result.task_list[i]._id }, { $push: { checklist_id: checklistid } })
                            await updatetasklist.save()
                        }

                        return res.status(201).json({ msg: "checklist created successfully" })
                    }

                    if (err) {
                        console.log(err)
                        return res.status(400).json({ error: err })
                    }

                })

            } else return res.status(400).json({ msg: "machine name cannot be empty" })

        } else return res.status(400).json({ msg: "checklist name cannot be empty" })

    } catch (error) {
        return new Error(error)
    }
}
module.exports = { getUsers, addUser, updateUser, deleteUser, addRole, getRoles, deleteRole, getAsset, addAsset, deleteAsset, addMultipleAsset, addAssetCategory, getAssetCategory, deleteAssetCategory, updateAssetCategory, addMachine, getMachine, deleteMachine, updateMachine, getSchedular, getOneSchedule, addSchedular, updateSchedular, deleteSchedular, addLocation, getLocation, updateLocation, deleteLocation, getChecklist, getOneChecklist, addChecklist }