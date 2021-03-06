"use strict";

const EFFECTS = {};

EFFECTS[EFFECT_TYPE.HOST] = function (entity, dt) {

	if (entity.infested === undefined || entity.infested === false) {
		entity.infested = true;
	}

	entity.health -= 1;

	if (entity.health > 0) { return; }

	entity.remove = true;

	entity.infested = false;

	const parasite = new Parasite(0);

	vec2.copy(entity.position, parasite.position);

	spawner.entities.push(parasite);

	sounds.walk(false);
};

EFFECTS[EFFECT_TYPE.SHOOT] = function (entity, dt) {

	entity.remove_effects.push(EFFECT_TYPE.SHOOT);

	if (entity.effects.indexOf(EFFECT_TYPE.RELOADING) >= 0) { return; }

	entity.add_effects.push(EFFECT_TYPE.LOUD);
	entity.add_effects.push(EFFECT_TYPE.RELOADING);

	const bullet = new Bullet(0);

	const weapon = WEAPON_DATA[entity.weapon_type];

	bullet.damage = weapon.damage;
	bullet.speed = weapon.projectile_speed;
	bullet.sprite = weapon.sprite;

	bullet.angle = entity.angle;

	vec2.angleToVec2(bullet.angle, bullet.position);
	vec2.scale(bullet.position, 48, bullet.position);
	vec2.add(entity.position, bullet.position, bullet.position);

	bullet.faction_type = entity.faction_type;

	spawner.entities.push(bullet);

};

EFFECTS[EFFECT_TYPE.RELOADING] = function (entity, dt) {
	if (entity.reload_remaining === undefined || entity.reload_remaining <= 0) {
		entity.reload_remaining = entity.reload_duration = WEAPON_DATA[entity.weapon_type].reload_duration;
	}

	entity.reload_remaining -= dt;

	if (entity.reload_remaining > 0) { return; }

	entity.remove_effects.push(EFFECT_TYPE.RELOADING);

};

EFFECTS[EFFECT_TYPE.MORTAL] = function (entity, dt) {
	if (entity.health > 0) { return; }

	if (entity.entity_type === ENTITY_TYPE.PARASITE) {
		playing = false;
	}

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

	entity.add_effects.push(EFFECT_TYPE.LOUD);
	entity.add_effects.push(EFFECT_TYPE.LUNGING);
	entity.add_effects.push(EFFECT_TYPE.RELOADING);
	entity.add_effects.push(EFFECT_TYPE.STUN);

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
};

// // @Chris - should this be handled here, and in this manner? This converts the sound to mono and filters out the higher frequencies incrementally over 1 second.
// EFFECTS[EFFECT_TYPE.DAMPEN_SOUND] = function (entity, dt) {
// 	if (entity.elapsed_time === undefined) {
// 		entity.elapsed_time = 0;
// 		entity.start_frequency = soundscape.filter.frequency.value;
// 	}

// 	const durationElapsedPercent = entity.elapsed_time / EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].duration;

// 	const targetFrequency = EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].filter_frequency;
// 	const frequencyDifference = entity.start_frequency - targetFrequency;
// 	const frequencyAmount = frequencyDifference * durationElapsedPercent;

// 	soundscape.filter.frequency.value = entity.start_frequency - frequencyAmount;

// 	soundscape.rightPan.pan.value = 1 - durationElapsedPercent;
// 	soundscape.leftPan.pan.value = -1 + durationElapsedPercent;

// 	entity.elapsed_time += dt;

// 	if (entity.elapsed_time < EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].duration) { return; }

// 	entity.remove_effects.push(EFFECT_TYPE.DAMPEN_SOUND);

// 	entity.elapsed_time = undefined;
// };

// // @Chris - same as above except converts to stereo and removes the filter.
// EFFECTS[EFFECT_TYPE.HIGHTEN_SOUND] = function (entity, dt) {
// 	if (entity.elapsed_time === undefined) {
// 		entity.elapsed_time = 0;
// 		entity.start_frequency = soundscape.filter.frequency.value;
// 	}

// 	const durationElapsedPercent = Math.min(1, entity.elapsed_time / EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].duration);

// 	const targetFrequency = EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].filter_frequency;
// 	const frequencyDifference = targetFrequency - entity.start_frequency;
// 	const frequencyAmount = frequencyDifference * durationElapsedPercent;
// 	soundscape.filter.frequency.value = entity.start_frequency + frequencyAmount;

// 	soundscape.rightPan.pan.value = durationElapsedPercent;
// 	soundscape.leftPan.pan.value = -durationElapsedPercent;

// 	entity.elapsed_time += dt;

// 	// if (entity.elapsed_time < EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].duration) { return; }
// 	//
// 	// entity.remove_effects.push(EFFECT_TYPE.HIGHTEN_SOUND);
// 	//
// 	// entity.elapsed_time = undefined;
// };
