require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')

app.use(bodyParser.json())

morgan.token('data', function (req, res) {
  const body = req.body
  return (JSON.stringify(body))
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :data'))


app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      console.log(savedPerson, typeof savedPerson)
      res.json(savedPerson)
    })
    .catch(error => next(error))
})


app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      res.set('Content-Type', 'text/html')
        .send(`<div>Phonebook has info over ${persons.length} people</div>
  <div> ${new Date()}</div>`)
    })
})


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        console.log(person)
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})




app.use(middleware.errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})