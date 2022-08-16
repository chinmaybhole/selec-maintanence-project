const mongoose = require('mongoose')
const Schema = mongoose.Schema

const images = new Schema({
    name: String,
    image: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true })

const taskList = new Schema({
    task: {
        type: String,
        unique: true,
        require: true
    },
    status: {
        type: String,
    },
    remark: String,
    image: images,
    checklist_id: [{
        type: Schema.Types.ObjectId,
        ref: 'checkList',
    }]
    
}, { timestamps: true })

const checkList = new Schema({
    machine_name: {
        type: Schema.Types.ObjectId,
        ref: 'machineData',
        require: true
    },
    date: Date,
    task_list: [{
        type: Schema.Types.ObjectId,
        ref: 'tasklist'
    }],
    checklist_status: {
        type: String,
    }

}, { timestamps: true })

let checklist = mongoose.model('checkList', checkList);
let imageModel = mongoose.model('images', images);
let tasklist = mongoose.model('tasklist', taskList);

module.exports = {
    checklist,
    imageModel,
    tasklist
}