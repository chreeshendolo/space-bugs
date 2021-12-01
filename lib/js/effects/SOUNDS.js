"use strict";

const SOUNDS = {};

SOUNDS[EFFECT_TYPE.SHOOT] = function (entity) {
	if (entity.effects.indexOf(EFFECT_TYPE.RELOADING) >= 0) { return; }

	sounds.play("gunshot");
};

SOUNDS[EFFECT_TYPE.LUNGE] = function (entity) {
	if (entity.effects.indexOf(EFFECT_TYPE.RELOADING) >= 0) { return; }

	sounds.play("lunge");
};

SOUNDS[CONTROL_TYPE.KEYBOARD_AND_MOUSE] = function (entity) {
	const keys = input.keys;

	let moving = false;
	if (keys["d"] && !keys["a"]) { moving = true; }
	if (keys["s"] && !keys["w"]) { moving = true; }
	if (keys["a"] && !keys["d"]) { moving = true; }
	if (keys["w"] && !keys["s"]) { moving = true; }

	const isParasite = entity.entity_type === ENTITY_TYPE.PARASITE;
	const movement = isParasite ? sounds.crawl : sounds.walk;

	movement(moving);
}

SOUNDS.effectHasSound = function (effect) {
	return Object.keys(this).indexOf(String(effect)) > -1;
}
