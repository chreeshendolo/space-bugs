"use strict";

function effects(entities, dt) {
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		for (let ii = 0; ii < entity.effects.length; ii++) {
			EFFECTS[entity.effects[ii]](entity, dt);
		}

	}
}
