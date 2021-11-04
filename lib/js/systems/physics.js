"use strict";

function physics(entities) {
	// not good/shouldn't be here
	const keys = input.keys;
	const mouse = input.mouse;

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		const position = entity.position;
		const velocity = entity.velocity;

		// not good/shouldn't be here
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

		vec2.normalize(velocity, velocity);

		position[0] += velocity[0];
		position[1] += velocity[1];

		velocity[0] = velocity[1] = 0;

		entity.angle = vec2.angle(vec2.subtract(mouse.position, position));
	}
};
