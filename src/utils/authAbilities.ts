import { AbilityBuilder, Ability } from '@casl/ability'
import { NextFunction, Response, Request } from 'express';
import { Users } from '../entity/users'

function defineAbilitiesFor(user: Users) {
    const { rules, can: allow, cannot: forbid } = AbilityBuilder.extract();

    if (!user) user = { role: { title: 'anonymous' } };

    if (user.role.title === 'anonymous') {
        allow('read', 'all');
        allow('create', ['Appointment']);
        forbid('manage', ['Admin', 'Profile']);
    }

    if (user.role.title === 'admin') {
        allow('manage', 'all');
    }

    if (user.role.title === 'member') {
        allow('read', 'all');
        allow('create', ['Appointment']);
        allow('update', 'Profile');
        forbid('manage', 'Admin');
    }

    return new Ability(rules)
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);

export = (req: Request, res: Response, next: NextFunction) => {
    req.ability = req.user ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY;
    next()
};
