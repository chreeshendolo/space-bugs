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

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.velocity === undefined) { continue; }

		const indexes = grid.indexesInRectangle(entity);

		for (let ii = 0; ii < indexes.length; ii++) {
			const index = indexes[ii];
			if (MAP_DATA[index] !== 1) { continue; }

			const rectangle = grid.rectangle(index);

			if (!intersect.circleRectangle(entity, rectangle)) { continue; }

			displace.circleRectangle(entity, rectangle);
		}

	}

};
