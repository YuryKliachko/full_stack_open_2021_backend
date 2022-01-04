import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import personService from './service/person'
import personsRouter from './controllers/persons'
import infoRouter from './controllers/info'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
morgan.token('body', (req: express.Request) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

personService.createClient()

app.use('/api/persons', personsRouter)
app.use('/info', infoRouter)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
