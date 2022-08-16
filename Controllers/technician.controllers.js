const upload = require('../Middleware/imageUpload.middleware')
const { imageModel } = require('../Models/checklist.model')


const imageUpload = async(req, res) => {
    upload(req, res, (err) => {
        if (err) console.log(err)

        const newImage = new imageModel({
            name: req.body.name,
            image: {
                data: req.file.filename,
                contentType: ['image/png', 'image/jpg', 'image/jpeg']
            }
        })
        try {
            await newImage.save()

        } catch (err) {
            res.json({ message: error });
        }
    })
}

module.exports = { imageUpload }