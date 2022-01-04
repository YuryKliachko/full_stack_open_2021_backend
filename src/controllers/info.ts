import { Router, Request, Response } from "express"
import personService from "../service/person"

const infoRouter = Router()

infoRouter.get('/', async (_: Request, resposne: Response) => {
    const count = await personService.getPersonsCount()
    resposne.send(`<div>Phonebook has info for ${count} people</div><div>${new Date()}</div>`)
});

export default infoRouter
