import { Ability } from '@casl/ability'

declare global {
    namespace Express {
        interface Request {
            ability?: Ability;
        }
    }
}
