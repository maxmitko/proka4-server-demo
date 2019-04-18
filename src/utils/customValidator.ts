import { getRepository } from "typeorm";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint()
export class isUnique implements ValidatorConstraintInterface {

    async validate(field: string, args: ValidationArguments) {

        const repository = getRepository(args.targetName)
        
        const result = await repository.count({ [args.property]: field })
        
        return !result
    }

    defaultMessage(args: ValidationArguments) {
        
        return `${args.value} уже занято`;
    }

}   