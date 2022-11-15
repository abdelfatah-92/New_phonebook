const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
 app.use(logger((tokens, req,res) => {
  return [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),'-',
    tokens.res(req,res,'content-length'),'-',
    tokens['response-time'](req,res),'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))



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


app.get('/info',(req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
              <p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req,res) => {
 const id = Number(req.params.id)
 const person = persons.find(n => n.id === id)
 person ?  res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(f => f.id !== id)
  console.log(persons);
  res.status(204).end()
})
const generatedId = Math.floor(Math.random() * 1000000000)

app.post('/api/persons', (req, res) => {
  const body = req.body
 // console.log(JSON.stringify(req.body));
  if(!body.name || !body.number ){
    res.status(400).json({error: "name or number missing"})
  }else{
  if(persons.find(...persons, n => n.name === body.name)){
    res.status(400).json({error: "name must be unique"})
  }else{

  const person ={
    id: generatedId,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  console.log(persons);
  res.json(person)
  }}
})


const PORT = 3001 
app.listen(PORT,() => {
    console.log(`server is working on port ${PORT}`);
})