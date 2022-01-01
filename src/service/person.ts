import mongoose from 'mongoose';
import Person from '../interfaces'
import { InvalidPersonId } from '../errors';

mongoose.set('toJSON', {
    virtuals: true,
    transform: (_, converted) => {
      delete converted._id;
    }
});

const schema = new mongoose.Schema<Person>({
    name: { type: String, required: true },
    number: { type: String, required: true },
}, {collection: 'persons'})

const PersonModel = mongoose.model<Person>('Person', schema);

const verifyId = (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidPersonId(id)
    }
}

const getPersons = async (attributes: string[] = []): Promise<Person[]> => {
    const projection = attributes.join(' ')
    const persons = await PersonModel.find({}, projection)
    console.log(`Fetched ${persons.length} persons`)
    return persons
}

const getById = async (id: string): Promise<Person> => {
    verifyId(id)
    const person = await PersonModel.findById(id)
    return person
}

const getByName = async (name: string): Promise<Person> => {
    return await PersonModel.findOne({name: name})
}

const deletePerson = async (id: string): Promise<Person> => {
    verifyId(id)
    return await PersonModel.findByIdAndDelete(id)
}

const upsertPerson = async (person: Person): Promise<Person> => {
    const query = {_id: person.id || new mongoose.mongo.ObjectId()}
    const update = {...person}
    delete update.id
    const options = {upsert: true, new: true, setDefaultsOnInsert: true }
    const updatedPerson = await PersonModel.findOneAndUpdate(query, update, options)
    return updatedPerson
}

const getPersonsCount = async () => {
    return await PersonModel.count()
}

const createClient = () => {
    const CLIENT_ID = process.env.MONGOATLAS_CLIENT_ID
    const CLIENT_SECRET = process.env.MONGOATLAS_CLIENT_SECRET
    if (!CLIENT_ID) {
        throw Error('Client ID should be set in order to connect to DB')
    }
    if (!CLIENT_SECRET) {
        throw Error('Client secret should be set in order to connect to DB')
    }
    mongoose.connect(`mongodb+srv://${CLIENT_ID}:${CLIENT_SECRET}@cluster0.bo6wq.mongodb.net/phonebook?retryWrites=true&w=majority`)
}

export default {
    createClient,
    getPersons,
    getById,
    deletePerson,
    upsertPerson,
    getPersonsCount,
    getByName
}
