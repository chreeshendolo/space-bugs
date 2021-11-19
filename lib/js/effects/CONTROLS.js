"use strict";

const CONTROLS = {};

CONTROLS[CONTROL_TYPE.KEYBOARD_AND_MOUSE] = function (entity) {

	const position = entity.position;
	const velocity = entity.velocity;

	const keys = input.keys;
	if (keys["d"] && !keys["a"]) {
		velocity[0] = 1;
	}

	if (keys["s"] && !keys["w"]) {
		velocity[1] = 1;
	}

	if (keys["a"] && !keys["d"]) {
		velocity[0] = -1;
	}

	if (keys["w"] && !keys["s"]) {
		velocity[1] = -1;
	}

	const mouse = vec2.copy(input.mouse.position);

	vec2.add(mouse, position, mouse);

	mouse[0] -= renderer.canvas.width * 0.5;
	mouse[1] -= renderer.canvas.height * 0.5;

	vec2.subtract(mouse, position, mouse);

	entity.angle = vec2.angle(mouse);

	if (input.mouse.left !== true || entity.primary_action === undefined) { return; }

	if (entity.effects.indexOf(entity.primary_action) >= 0) { return; }
	entity.effects.push(entity.primary_action);
	soundscape.shoot();
};

CONTROLS[CONTROL_TYPE.AI] = function (entity) {

	let player = undefined;
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.player !== true) { continue; }
		player = entity;
	}

	if (player === undefined) { return; }

	const point = vec2.subtract(player.position, entity.position);

	entity.angle = vec2.angle(point);

};

CONTROLS[CONTROL_TYPE.PROJECTILE] = function (entity) {

	vec2.angleToVec2(entity.angle, entity.velocity);

};
