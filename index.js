require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
const bodyParser = require('body-parser')

app.use(bodyParser.json())

morgan.token('data', function (req, res) {
  const body = req.body
  return (JSON.stringify(body))
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :data'))


// let persons = [
//     {
//       name: "Arto Hellassss",
//       number: "040-123456",
//       id: 1
//     },
//     {
//       name: "Ada Lovelace",
//       number: "39-44-5323523",
//       id: 2
//     },
//     {
//       name: "Mary Poppendieck",
//       number: "39-23-6423122",
//       id: 3
//     },
//     {
//       name: "aaa",
//       number: "555",
//       id: 4
//     }
//   ]

const generateId = (min, max) => {  
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}



// app.post('/api/persons', (req, res) => {
//   const body = req.body
//   console.log(body)
  
//   if ((!body.name) || (!body.number)){
//     return res.status(400).json({ 
//       error: 'information missing' 
//     })
//   }else if(persons.find(person => person.name === body.name)){
//     return res.status(400).json(
//       { error: 'name must be unique' }
//     )
//   }
//   const person = {
//     name: body.name,
//     number: body.number,
//     id: generateId(0, 99999999999),
//   }

//   console.log(person)
  
//   persons = persons.concat(person)

//   res.json(person)
// })


app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // if ((!body.name) || (!body.number)) {
  //   return res.status(400).json({ error: 'content missing' })
  // }
  // else if(persons.find(person => person.name === body.name)){
  //   return res.status(400).json(
  //     { error: 'name must be unique' }
  //   )
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
  })
  .catch(error => next(error))
})


app.get('/info', (req, res) => {
  Person.find({})
  .then(persons => {
      res.set('text/html').send(`<div>Phonebook has info over ${persons.length} people</div>
  <div> ${new Date()}</div>`)
  })
})




// app.get('/api/persons', (req, res) => {
//   res.json(persons)
// })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person.toJSON())
      } else {
        res.status(204).end()
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
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})


// app.get('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)
//   const person = persons.find(person => person.id === id)
  
//   if(person){
//       res.json(person)
//   } else {
//     res.status(404).end()
//   }
// })

// app.delete('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)
//   persons = persons.filter(person => person.id !== id)

//   res.status(204).end()
// })

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})