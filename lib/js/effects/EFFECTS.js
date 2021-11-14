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

	parasite.effects.push(EFFECT_TYPE.DAMPEN_SOUND);

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

// @Chris - should this be handled here, and in this manner? This converts the sound to mono and filters out the higher frequencies incrementally over 1 second.
EFFECTS[EFFECT_TYPE.DAMPEN_SOUND] = function (entity, dt) {
	if (entity.elapsed_time === undefined) {
		entity.elapsed_time = 0;
		entity.start_frequency = music.filter.frequency.value;
	}

	const durationElapsedPercent = entity.elapsed_time / EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].duration;

	const targetFrequency = EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND].filter_frequency;
	const frequencyDifference = entity.start_frequency - targetFrequency;
	const frequencyAmount = frequencyDifference * durationElapsedPercent;

	music.filter.frequency.value = entity.start_frequency - frequencyAmount;

	music.rightPan.pan.value = 1 - durationElapsedPercent;
	music.leftPan.pan.value = -1 + durationElapsedPercent;

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
		entity.start_frequency = music.filter.frequency.value;
	}

	const durationElapsedPercent = entity.elapsed_time / EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].duration;

	const targetFrequency = EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].filter_frequency;
	const frequencyDifference = targetFrequency - entity.start_frequency;
	const frequencyAmount = frequencyDifference * durationElapsedPercent;
	music.filter.frequency.value = entity.start_frequency + frequencyAmount;

	music.rightPan.pan.value = durationElapsedPercent;
	music.leftPan.pan.value = -durationElapsedPercent;

	entity.elapsed_time += dt;

	if (entity.elapsed_time < EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND].duration) { return; }

	const index = entity.effects.indexOf(EFFECT_TYPE.HIGHTEN_SOUND);
	entity.effects.splice(index, 1);

	entity.elapsed_time = undefined;
};
