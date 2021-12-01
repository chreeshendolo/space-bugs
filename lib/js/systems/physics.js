"use strict";

function physics(entities) {

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.velocity === undefined) { continue; }

		const position = entity.position;
		const velocity = entity.velocity;

		vec2.add(position, velocity, position);

		velocity[0] = velocity[1] = 0;

	}

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.velocity === undefined) { continue; }

		const indexes = grid.indexesInRectangle(entity);

		for (let ii = 0; ii < indexes.length; ii++) {
			const index = indexes[ii];

			switch (entity.entity_type) {
				case ENTITY_TYPE.PROJECTILE: {
					if (MAP_DATA[index] !== 0) {
						entity.remove = true;
					}
					continue;
				}
				case ENTITY_TYPE.CREATURE: {
					if (MAP_DATA[index] === 0) { continue; }
					break;
				}
				case ENTITY_TYPE.PARASITE: {
					if (MAP_DATA[index] !== 1) { continue; }
					break;
				}
			}

			const rectangle = grid.rectangle(index);

			if (!intersect.circleRectangle(entity, rectangle)) { continue; }
			displace.circleRectangle(entity, rectangle);
		}

	}

	const interactions = [];
	for (let i = 0; i < entities.length; i++) {
		const entityA = entities[i];
		for (let ii = 0; ii < entities.length; ii++) {
			if (i === ii) { continue; }

			const entityB = entities[ii];

			if ((entityA.collision_mask & entityB.entity_type) === 0) { continue; }
			if (!intersect.circleCircle(entityA, entityB)) { continue; }

			interactions.push([entityA, entityB]);

		}

	}

	for (let i = 0; i < interactions.length; i++) {
		const entityA = interactions[i][0];
		const entityB = interactions[i][1];

		INTERACTIONS[entityA.entity_type | entityB.entity_type](entityA, entityB);
	}

};
