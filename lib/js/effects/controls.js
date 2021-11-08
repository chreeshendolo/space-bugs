"use strict";

const CONTROLS = {};

CONTROLS[CONTROL_TYPE.KEYBOARD_AND_MOUSE] = function (entity) {

	const position = entity.position;
	const velocity = entity.velocity;

	const keys = input.keys;
	if (keys[entity.right] && !keys[entity.left]) {
		velocity[0] = 1;
	}

	if (keys[entity.down] && !keys[entity.up]) {
		velocity[1] = 1;
	}

	if (keys[entity.left] && !keys[entity.right]) {
		velocity[0] = -1;
	}

	if (keys[entity.up] && !keys[entity.down]) {
		velocity[1] = -1;
	}

	const mouse = input.mouse;
	entity.angle = vec2.angle(vec2.subtract(mouse.position, position));

};
