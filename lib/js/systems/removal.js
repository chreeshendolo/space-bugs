"use strict";

function removal(entities) {
	for (let i = entities.length - 1; i >= 0; i--) {
		const entity = entities[i];
		if (entity.remove !== true) { continue; }
		entities.splice(i, 1);
	}
};
