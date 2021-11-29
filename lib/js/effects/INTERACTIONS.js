"use strict";

const INTERACTIONS = {};

INTERACTIONS[ENTITY_TYPE.PARASITE | ENTITY_TYPE.CREATURE] = function (entityA, entityB) {
	if (entityA.entity_type === ENTITY_TYPE.PARASITE) {
		const parasite = entityA;
		const creature = entityB;

		parasite.remove = true;
	} else {
		const parasite = entityB;
		const creature = entityA;

		creature.player = true;
		creature.control_type = CONTROL_TYPE.KEYBOARD_AND_MOUSE;
		creature.faction_type = parasite.faction_type;

		creature.effects.push(EFFECT_TYPE.HOST);

		const index = creature.effects.indexOf(EFFECT_TYPE.STUN);
		if (index < 0) { return; }
		creature.stun_duration = undefined;
		creature.effects.splice(index, 1);
		creature.effects.push(EFFECT_TYPE.HIGHTEN_SOUND);
	}
};

INTERACTIONS[ENTITY_TYPE.PARASITE | ENTITY_TYPE.PROJECTILE] = function (projectile, parasite) {

	if (projectile.faction_type === parasite.faction_type) { return; }

	parasite.health -= projectile.damage;

	projectile.remove = true;

};

INTERACTIONS[ENTITY_TYPE.CREATURE | ENTITY_TYPE.PROJECTILE] = function (projectile, creature) {

	if (projectile.faction_type === creature.faction_type) { return; }

	creature.health -= projectile.damage;

	projectile.remove = true;

};
