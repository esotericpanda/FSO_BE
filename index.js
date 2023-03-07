const express = require('express')
const morgan = require('morgan')
const cors = require('cors')



morgan.token('body', function (req, res) { return req.method === "POST" ? JSON.stringify(req.body) : ""})



const app = express()
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(cors())
app.use(express.json())
app.use(logger)
app.use(express.static('build'))

let persons =[
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

app.get('/api/persons',(request, response)=>{
    response.json(persons)
})

app.get('/info',(request, response)=>{
    const date = new Date()
    response.send(
        `Phonebook has ${persons.length} people <br/>
        ${date}`
    )
})

app.get('/api/persons/:id',(request,response)=>{
    const id = +request.params.id

    const person=persons.find(p=>p.id===id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = +request.params.id

    persons= persons.filter(p=>p.id!==id)

    response.status(204).end()
})

const generateId=()=>{
    return Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)
}

app.post('/api/persons', (request, response)=>{

    const body = request.body;

    if(!(body.name && body.number)){
        response.status(400).json({error:'insufficient data: name and number required'})
        return
    }

    if(persons.some(p=>p.name===body.name)){
        response.status(400).json({error: 'name must be unique'})
        return
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons=persons.concat(newPerson)
    response.json(newPerson)
})

const PORT= process.env.PORT || 3001

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})