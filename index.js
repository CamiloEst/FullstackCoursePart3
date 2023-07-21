const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')


app.use(express.json());
app.use(cors())


app.use(express.static('build'))

morgan.token('req-body', (req, res) =>   JSON.stringify(req.body))

app.use(morgan(':method :url :status - :response-time ms :req-body' ))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const personsSize = persons.length;
  response.send(`<p>Phonebook has info for ${personsSize} people</p> 
                    <p>${new Date()}</p>`).end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person === undefined) return response.status(404).send(`Error 404: Person with id ${id} not found`).end();

  return response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person === undefined) return response.status(404).send(`Error 404: Person with id ${id} not found`).end();

  persons = persons.filter((p) => p.id !== id);
  return response.status(204).end();
});


app.post("/api/persons", (request, response) => {
  const {name, number} = request.body;
 
  if (!name ) {
    return response.status(400).json({
      error: "Name missing",
    });
  }

  if (!number) {
    return response.status(400).json({
      error: "Number missing",
    });
  }

  if(persons.some(p => p.name === name )){
    return response.status(409).json({
        error: "Person already exist",
      });
  }

  const person = {
    name: name,
    number:number,
    id: Math.floor(Math.random() * 999999)
  };

  persons = persons.concat(person);
  response.json(person);
});


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  

app.use(unknownEndpoint)


const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

