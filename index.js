const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')


morgan.token('body', function (req, res) { return req.method === "POST" ? JSON.stringify(req.body) : "" })



const app = express()
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')


app.use(logger)
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(res => {
            console.log(res)
            response.json(res)
        })
})

app.get('/info', (request, response) => {
    Person.find({})
        .then((res) => {
            const date = new Date()
            response.send(
                `Phonebook has ${res.length} people <br/>
                ${date}`
            )
        })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(res => { response.json(res) })
        .catch(err => response.status(400).json({ error: "person not found" }))

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    Person.findByIdAndRemove(id)
        .then(response.status(204).end())
})


app.post('/api/persons', (request, response) => {

    const body = request.body;

    if (!(body.name && body.number)) {
        response.status(400).json({ error: 'insufficient data: name and number required' })
        return
    }

    Person.exists({ name: body.name }).then((res) => {
        if (res !== null) {
            console.log('there')
            response.status(400).json({ error: 'name must be unique' })
            return
        }

        const person = new Person({
            name: body.name,
            number: body.number,
        })
        person.save().then(res => {
            response.json(res)
        })

    })
})



const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})