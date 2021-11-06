"use strict";

input.initialize();
renderer.initialize(960, 540);

const entities = [new Creature(ENTITY_TYPE.PLAYER)];

assets.load(loop);

function loop(time = 0) {
	requestAnimationFrame(loop);

	if (input.keys["p"]) {
		sounds.get("music").play();
	}

	physics(entities);
	render(entities);
}
