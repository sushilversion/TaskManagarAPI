const mongoose = require('mongoose')

const taskSchema=new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User' 
    }
},{
    timestamps:true
})
// add any middleware code onto above scheama, eg, pre, validator
const Task = mongoose.model('Task', taskSchema)

module.exports = Task