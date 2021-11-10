"use strict";

const EFFECTS = {};

EFFECTS[EFFECT_TYPE.HOST] = function (entity, dt) {
	if (entity.host_timer === undefined) {
		entity.host_timer = EFFECT_DATA[EFFECT_TYPE.HOST].duration;
	}

	entity.host_timer -= dt;

	if (entity.host_timer > 0) { return; }

	entity.host_timer = undefined;

	const index = entity.effects.indexOf(EFFECT_TYPE.HOST);
	entity.effects.splice(index, 1);

	const parasite = new Parasite(0);

	vec2.copy(entity.position, parasite.position);

	entities.push(parasite);

	entity.remove = true;
};

EFFECTS[EFFECT_TYPE.SHOOT] = function (entity, dt) {

	if (entity.shot_timer === undefined || entity.shot_timer <= 0) {
		const bullet = new Bullet(0);

		vec2.copy(entity.position, bullet.position);
		bullet.angle = entity.angle;

		bullet.faction_type = entity.faction_type;

		entities.push(bullet);

		entity.shot_timer = EFFECT_DATA[EFFECT_TYPE.SHOOT].duration;

		return;
	}

	entity.shot_timer -= dt;

	if (entity.shot_timer > 0) { return; }

	const index = entity.effects.indexOf(EFFECT_TYPE.SHOOT);
	entity.effects.splice(index, 1);

};
