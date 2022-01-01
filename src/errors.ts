export class InvalidPersonId extends Error {
    constructor(id: string) {
        super(`Person ID ${id} is not valid`);
    }
}
