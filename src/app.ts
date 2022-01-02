import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import personService from './service/person'
import { InvalidPersonId } from './errors'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
morgan.token('body', (req: express.Request) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

personService.createClient()

app.get('/api/persons', async (_: express.Request, resposne: express.Response) => {
  console.log('Serving persons ..')
  const persons = await personService.getPersons()
  resposne.json(persons)
});

app.get('/api/persons/:id', async (request: express.Request, resposne: express.Response) => {
  const id = request.params.id
  try {
    const person = await personService.getById(id)
    if (!person) {
      return resposne.status(404).send(`No person found with ID ${id}`)
    }
    resposne.json(person)
  } catch (error) {
    if (error instanceof InvalidPersonId) {
      return resposne.status(400).send(error.message)
    } else {
      return resposne.status(500).send('There is an errror occurred while fetching person')
    }
  }
});

app.delete('/api/persons/:id', async (request: express.Request, resposne: express.Response) => {
  const personId = request.params.id
  try {
    const person = await personService.deletePerson(personId)
    if (!person) {
      return resposne.status(404).send(`Person ${personId} not found`)
    }
    resposne.status(204).send(`Person ${personId} successfully deleted`)
  } catch (error) {
    if (error instanceof InvalidPersonId) {
      return resposne.status(400).send(error.message) 
    } else {
      return resposne.status(500).send('There is an errror occurred while fetching person')
    }
  }
});

app.post('/api/persons', async (request: express.Request, resposne: express.Response) => {
  try {
    const addedPerson = await personService.upsertPerson({...request.body})
    resposne.status(201).send(`Person ${addedPerson.name} successfully added to the phonebook`)
  } catch (error) {
    console.log(error)
    return resposne.status(400).send(error.message)
  }
});

app.put('/api/persons/:id', async (request: express.Request, resposne: express.Response) => {
  try {
    const updatedPerson = await personService.upsertPerson({...request.body, id: request.params.id})
    resposne.status(200).send(`Data for person ${updatedPerson.name} successfully updated`)
  } catch (error) {
    console.log(error)
    return resposne.status(400).send(error.message)
  }

});

app.get('/info', async (_: express.Request, resposne: express.Response) => {
  const count = await personService.getPersonsCount()
  resposne.send(`<div>Phonebook has info for ${count} people</div><div>${new Date()}</div>`)
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
