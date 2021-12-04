"use strict";

function spawn(entities) {
	for (let i = 0; i < spawner.entities.length; i++) {
		entities.push(spawner.entities[i]);
	}

	spawner.entities.length = 0;
};
