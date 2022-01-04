import { Router, Request, Response } from "express"
import { InvalidPersonId } from "../errors";
import personService from "../service/person"

const personsRouter = Router()

personsRouter.get('/', async (_: Request, resposne: Response) => {
    console.log('Serving persons ..')
    const persons = await personService.getPersons()
    resposne.json(persons)
});

personsRouter.post('/', async (request: Request, resposne: Response) => {
    try {
        const addedPerson = await personService.upsertPerson({ ...request.body })
        resposne.status(201).send(`Person ${addedPerson.name} successfully added to the phonebook`)
    } catch (error) {
        console.log(error)
        return resposne.status(400).send(error.message)
    }
});

personsRouter.get('/:id', async (request: Request, resposne: Response) => {
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

personsRouter.delete('/:id', async (request: Request, resposne: Response) => {
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

personsRouter.put('/:id', async (request: Request, resposne: Response) => {
    try {
        const updatedPerson = await personService.upsertPerson({ ...request.body, id: request.params.id })
        resposne.status(200).send(`Data for person ${updatedPerson.name} successfully updated`)
    } catch (error) {
        console.log(error)
        return resposne.status(400).send(error.message)
    }

});

export default personsRouter
