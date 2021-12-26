import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import Person from './interfaces'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
morgan.token('body', (req: express.Request) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons: Person[] = [
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

const getPerson = (id: number): Person => {
  console.log(`Retrieving person with ID ${id}`)
  return persons.find(person => person.id === id)
}

app.get('/api/persons', (_: express.Request, resposne: express.Response) => {
  console.log('Serving persons ..')
  resposne.json(persons)
});

app.get('/api/persons/:id', (request: express.Request, resposne: express.Response) => {
  const personId = Number(request.params.id)
  const person = getPerson(personId)
  if (!person) {
    return resposne.status(404).end()
  }
  resposne.json(person)
});

app.delete('/api/persons/:id', (request: express.Request, resposne: express.Response) => {
  const personId = Number(request.params.id)
  const person = getPerson(personId)
  if (!person) {
    return resposne.status(404).send(`Person ${personId} not found`)
  }
  persons = persons.filter(p => p.id !== personId)
  resposne.status(204).send(`Person ${personId} successfully deleted`)
});

app.post('/api/persons', (request: express.Request, resposne: express.Response) => {
  let validationError = ''
  const personName = request.body.name
  const personNumber = request.body.number

  if (!personName) {
    validationError = 'New person must have name\n'
  } else {
    const personNames = persons.map(p => p.name)
    if (personNames.includes(personName)) {
      validationError = validationError.concat(`Person with name ${personName} already exists in phonebook\n`)
    }
  }
  if (!personNumber) {
    validationError = validationError.concat('New person must have number')
  }
  if (validationError) {
    return resposne.status(400).send(validationError)
  }

  const maxId = Math.max(...persons.map(person => person.id))
  const newPerson: Person = {id: maxId + 1, ...request.body}
  persons = persons.concat(newPerson)
  resposne.status(201).send(`Person ${newPerson.name} successfully added to the phonebook`)
});

app.get('/info', (_: express.Request, resposne: express.Response) => {
  resposne.send(`<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`)
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
