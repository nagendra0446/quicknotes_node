const mongoose = require('mongoose')
const Schema = mongoose.Schema

const note = new Schema({
    user: String,
    title: String,
    status: String,
    notes: String,
})

module.exports = mongoose.model('note', note)