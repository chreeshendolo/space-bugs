"use strict";

function control(entities) {

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.control_type === undefined) { continue; }

		CONTROLS[entity.control_type](entity);

	}

};
