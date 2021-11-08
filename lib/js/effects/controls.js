"use strict";

const CONTROLS = {};

CONTROLS[CONTROL_TYPE.KEYBOARD_AND_MOUSE] = function (player) {
	const position = player.velocity;
	const velocity = player.velocity;

	const keys = input.keys;
	const mouse = input.mouse;
	if (keys["a"] && !keys["d"]) {
		velocity[0] = -1;
	}

	if (keys["d"] && !keys["a"]) {
		velocity[0] = 1;
	}

	if (keys["w"] && !keys["s"]) {
		velocity[1] = -1;
	}

	if (keys["s"] && !keys["w"]) {
		velocity[1] = 1;
	}

	entity.angle = vec2.angle(vec2.subtract(mouse.position, position));

	if (!mouse.down) { return; }

	player.shoot = true;

};
