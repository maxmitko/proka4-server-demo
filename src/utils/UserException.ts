
export class ValidationException extends Error {
    message: string;
    errors: object;

    constructor(errors: object) {
        super("ORM validation failed");
        this.errors = errors;
    }
}