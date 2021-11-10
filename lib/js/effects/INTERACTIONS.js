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

		creature.effects.push(EFFECT_TYPE.HOST);
	}
};

INTERACTIONS[ENTITY_TYPE.PARASITE | ENTITY_TYPE.PROJECTILE] = function (entityA, entityB) {
	if (entityA.entity_type === ENTITY_TYPE.PARASITE) {
		const parasite = entityA;
		const projectile = entityB;

		// parasite.remove = true;

	} else {
		const parasite = entityB;
		const projectile = entityA;

		if (parasite.faction_type === projectile.faction_type) { return; }

		projectile.remove = true;

	}
};

INTERACTIONS[ENTITY_TYPE.CREATURE | ENTITY_TYPE.PROJECTILE] = function (entityA, entityB) {
	if (entityA.entity_type === ENTITY_TYPE.CREATURE) {
		const creature = entityA;
		const projectile = entityB;

		// creature.remove = true;

	} else {
		const creature = entityB;
		const projectile = entityA;

		if (creature.faction_type === projectile.faction_type) { return; }

		projectile.remove = true;

	}
};
