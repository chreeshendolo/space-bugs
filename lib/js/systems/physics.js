"use strict";

function physics(entities) {

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.velocity === undefined) { continue; }

		const position = entity.position;
		const velocity = entity.velocity;

		vec2.normalize(velocity, velocity);

		position[0] += velocity[0];
		position[1] += velocity[1];

		velocity[0] = velocity[1] = 0;

	}
};
