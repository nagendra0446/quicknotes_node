const mongoose = require('mongoose')
const Schema = mongoose.Schema

const app_user = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    mobile: String,
    username: String,
    pass: String,
})

module.exports = mongoose.model('app_user', app_user)