const mongoose = require('mongoose')

if (process.argv.length < 3){
    process.exit(1)
}

const password = [process.argv[2]]
const url = `mongodb+srv://jpine:${password}@cluster0.gjoguoe.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('person',personSchema)
const printAll = ()=>{
    Person
    .find({})
    .then((res)=>{
        console.log('phonebook:')
        res.forEach(p=>{
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}

const addPerson =(name, number)=>{
    const person =new Person({name,number})
    person.save().then(()=>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

if(process.argv.length < 5){
    printAll()
}else{
    addPerson(process.argv[3],process.argv[4])
}
