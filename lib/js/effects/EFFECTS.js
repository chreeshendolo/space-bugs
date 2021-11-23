"use strict";

const EFFECTS = {};

EFFECTS[EFFECT_TYPE.HOST] = function (entity, dt) {

	entity.health -= 1;

	if (entity.health > 0) { return; }

	const parasite = new Parasite(0);

	vec2.copy(entity.position, parasite.position);

	entities.push(parasite);

	parasite.effects.push(EFFECT_TYPE.DAMPEN_SOUND);
};

EFFECTS[EFFECT_TYPE.SHOOT] = function (entity, dt) {

	entity.remove_effects.push(EFFECT_TYPE.SHOOT);

	if (entity.effects.indexOf(EFFECT_TYPE.RELOADING) >= 0) { return; }

	entity.effects.push(EFFECT_TYPE.LOUD);
	entity.effects.push(EFFECT_TYPE.RELOADING);

	const bullet = new Bullet(0);

	const weapon = WEAPON_DATA[entity.weapon_type];
	bullet.damage = weapon.damage;
	bullet.speed = weapon.projectile_speed;

	vec2.copy(entity.position, bullet.position);
	bullet.angle = entity.angle;

	bullet.faction_type = entity.faction_type;

	entities.push(bullet);

};

EFFECTS[EFFECT_TYPE.RELOADING] = function (entity, dt) {
	if (entity.reload_duration === undefined || entity.reload_duration <= 0) {
		entity.reload_duration = WEAPON_DATA[entity.weapon_type].reload_duration;
	}

	entity.reload_duration -= dt;

	if (entity.reload_duration > 0) { return; }

	entity.remove_effects.push(EFFECT_TYPE.RELOADING);

};

EFFECTS[EFFECT_TYPE.MORTAL] = function (entity, dt) {
	if (entity.health > 0) { return; }

	entity.remove = true;
};

EFFECTS[EFFECT_TYPE.LOUD] = function (entity, dt) {
	if (entity.loud_duration === undefined || entity.loud_duration <= 0) {
		entity.loud_duration = EFFECT_DATA[EFFECT_TYPE.LOUD].duration;
	}

	entity.loud_duration -= dt;

	if (entity.loud_duration > 0) { return; }

	entity.remove_effects.push(EFFECT_TYPE.LOUD);

};

EFFECTS[EFFECT_TYPE.LUNGE] = function (entity, dt) {

	entity.remove_effects.push(EFFECT_TYPE.LUNGE);

	if (entity.effects.indexOf(EFFECT_TYPE.RELOADING) >= 0) { return; }

	entity.effects.push(EFFECT_TYPE.LOUD);
	entity.effects.push(EFFECT_TYPE.LUNGING);
	entity.effects.push(EFFECT_TYPE.RELOADING);
	entity.effects.push(EFFECT_TYPE.STUN);

};

EFFECTS[EFFECT_TYPE.LUNGING] = function (entity, dt) {
	if (entity.lunge_duration === undefined || entity.lunge_duration <= 0) {
		entity.lunge_duration = EFFECT_DATA[EFFECT_TYPE.LUNGING].duration;
	}

	const duration = 1 - entity.lunge_duration / EFFECT_DATA[EFFECT_TYPE.LUNGING].duration;

	vec2.angleToVec2(entity.angle, entity.velocity);

	vec2.scale(entity.velocity, WEAPON_DATA[entity.weapon_type].projectile_speed, entity.velocity);

	entity.lunge_duration -= dt;

	if (entity.lunge_duration > 0) { return; }

	entity.remove_effects.push(EFFECT_TYPE.LUNGING);

};

EFFECTS[EFFECT_TYPE.STUN] = function (entity, dt) {
	if (entity.stun_duration === undefined || entity.stun_duration <= 0) {
		entity.stun_duration = EFFECT_DATA[EFFECT_TYPE.STUN].duration;

		entity.hold_control_type = entity.control_type;

		entity.control_type = CONTROL_TYPE.NONE;
	}

	entity.stun_duration -= dt;

	if (entity.stun_duration > 0) { return; }

	entity.control_type = entity.hold_control_type;

	entity.remove_effects.push(EFFECT_TYPE.STUN);
	const index = entity.effects.indexOf(EFFECT_TYPE.SHOOT);
	entity.effects.splice(index, 1);
};

// @Chris - should this be handled here, and in this manner? This converts the sound to mono and filters out the higher frequencies incrementally over 1 second.
EFFECTS[EFFECT_TYPE.DAMPEN_SOUND] = function (entity, dt) {
	if (entity.elapsed_time === undefined) {
		entity.elapsed_time = 0;
		entity.start_frequency = soundscape.filter.frequency.value;
	}

	const durationElapsedPercent = entity.elapsed_time / EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].duration;

	const targetFrequency = EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].filter_frequency;
	const frequencyDifference = entity.start_frequency - targetFrequency;
	const frequencyAmount = frequencyDifference * durationElapsedPercent;

	soundscape.filter.frequency.value = entity.start_frequency - frequencyAmount;

	soundscape.rightPan.pan.value = 1 - durationElapsedPercent;
	soundscape.leftPan.pan.value = -1 + durationElapsedPercent;

	entity.elapsed_time += dt;

	if (entity.elapsed_time < EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].duration) { return; }

	const index = entity.effects.indexOf(EFFECT_TYPE.DAMPEN_SOUND);
	entity.effects.splice(index, 1);

	entity.elapsed_time = undefined;
};

// @Chris - same as above except converts to stereo and removes the filter.
EFFECTS[EFFECT_TYPE.HIGHTEN_SOUND] = function (entity, dt) {
	if (entity.elapsed_time === undefined) {
		entity.elapsed_time = 0;
		entity.start_frequency = soundscape.filter.frequency.value;
	}

	const durationElapsedPercent = entity.elapsed_time / EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].duration;

	const targetFrequency = EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].filter_frequency;
	const frequencyDifference = targetFrequency - entity.start_frequency;
	const frequencyAmount = frequencyDifference * durationElapsedPercent;
	soundscape.filter.frequency.value = entity.start_frequency + frequencyAmount;

	soundscape.rightPan.pan.value = durationElapsedPercent;
	soundscape.leftPan.pan.value = -durationElapsedPercent;

	entity.elapsed_time += dt;

	if (entity.elapsed_time < EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].duration) { return; }

	const index = entity.effects.indexOf(EFFECT_TYPE.HIGHTEN_SOUND);
	entity.effects.splice(index, 1);

	entity.elapsed_time = undefined;
};
