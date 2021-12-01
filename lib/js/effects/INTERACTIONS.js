"use strict";

const INTERACTIONS = {};

INTERACTIONS[ENTITY_TYPE.PARASITE | ENTITY_TYPE.CREATURE] = function (entityA, entityB) {
	if (entityA.entity_type === ENTITY_TYPE.PARASITE) {
		const parasite = entityA;
		const creature = entityB;

		parasite.remove = true;
		sounds.crawl(false);
		sounds.play("host");
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
		// creature.effects.push(EFFECT_TYPE.HIGHTEN_SOUND);
	}
};

INTERACTIONS[ENTITY_TYPE.PROJECTILE | ENTITY_TYPE.PARASITE] = function (projectile, parasite) {

	if (projectile.faction_type === parasite.faction_type) { return; }

	parasite.health -= projectile.damage;

	projectile.remove = true;

};

INTERACTIONS[ENTITY_TYPE.PROJECTILE | ENTITY_TYPE.CREATURE] = function (projectile, creature) {

	if (projectile.faction_type === creature.faction_type) { return; }

	creature.health -= projectile.damage;

	projectile.remove = true;

};

INTERACTIONS[ENTITY_TYPE.PRISONER | ENTITY_TYPE.PARASITE] = function (prisoner, parasite) {

	if (prisoner.faction_type !== parasite.faction_type) { return; }

	if (!prisoner.free) {
		sounds.play("prisonOpen");
	}

	prisoner.free = true;
	prisoner.sprite = "parasite_prison_open";

	if (allPrisonersFree()) { playing = false; }
};

INTERACTIONS[ENTITY_TYPE.PRISONER | ENTITY_TYPE.CREATURE] = function (prisoner, creature) {

	if (prisoner.faction_type !== creature.faction_type) { return; }

	if (!prisoner.free) {
		sounds.play("prisonOpen");
	}

	prisoner.free = true;
	prisoner.sprite = "parasite_prison_open";

	if (allPrisonersFree()) { playing = false; }
};

function allPrisonersFree() {
	let prisoners = 0;
	let free = 0;

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		if (entity.entity_type === ENTITY_TYPE.PRISONER) {
			prisoners++;

			if (entity.free) { free++; }
		}
	}

	return free === prisoners;
}
