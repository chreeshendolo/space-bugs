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

	const mouse = input.mouse;
	entity.angle = vec2.angle(vec2.subtract(mouse.position, position));

};
