require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())

app.use(express.static('build'))

morgan.token('req-body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status - :response-time ms :req-body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

app.get('/info', (request, response) => {
  Person.count({}).then((size) => {
    response
      .send(`<p>Phonebook has info for ${size} people </p> <p>${new Date()}</p>`)
      .end()
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response
          .status(404)
          .send(`<p>Person with id <b>${id}</b> not found</p>`)
          .end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        response
          .status(404)
          .send(`<p>Person with id <b>${id}</b> not found</p>`)
          .end()
      }
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({ name, number })

  person
    .save()
    .then((newPerson) => response.json(newPerson))
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const id = request.params.id
  const person = { name, number }

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response
          .status(404)
          .send(`<p>Person with id <b>${id}</b> not found</p>`)
          .end()
      }
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
