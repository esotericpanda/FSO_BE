const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(res=>{
        console.log('connected')
    }).catch(err=>{
        console.log(`an error occured: ${err.message}`)
    })

const personSchema =new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJson', {
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        
    }
})




module.exports =  mongoose.model('person',personSchema)