const {Schema, model} = require('mongoose')
const user = new Schema({
    name: { type: String, required: true },
    lname: String,
    password: {
        type: String,
        required: true,
    },
    email: { 
        type: String, 
        required: true 
    },
    resetToken:String,
    resetTokenExp:Date,
    skills: { 
        type: Array, 
        default: [] 
    },
    img: String,
})
module.exports = model('User',user)