"use strict";

images.load(["./assets/images/player.png"], loop);

input.initialize();
renderer.initialize(960, 540);

const entities = [new Player()];

function loop(time = 0) {
	requestAnimationFrame(loop);

	physics(entities);
	render(entities);
}
