const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(user) {
    const { rules, can: allow, cannot: forbid } = AbilityBuilder.extract();

    if (!user) user = { role: 'anonymous' };

    if (user.role === 'anonymous') {
        allow('read', 'all');
        forbid('manage', ['Admin', 'Profile']);
    }

    if (user.role === 'admin') {
        allow('manage', 'all');
    }

    if (user.role === 'member') {
        allow('read', 'all');
        allow('update', 'Profile');
        forbid('manage', 'Admin');
    }

    return new Ability(rules)
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);
const DEVELOPMENT_ABILITY = defineAbilitiesFor({ role: 'admin' });

module.exports = function createAbilities(req, res, next) {

    if (process.env.NODE_ENV == 'development') {
        req.ability = DEVELOPMENT_ABILITY;
    } else {
        req.ability = req.user ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY;
    }

    next()
};
