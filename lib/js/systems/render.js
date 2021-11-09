"use strict";

function render(entities) {

	const context = renderer.context;
	context.resetTransform();
	context.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.camera) {
			vec2.copy(entity.position, camera.position);
			break;
		}
	}

	context.translate(-camera.position[0] + renderer.canvas.width * 0.5, -camera.position[1] + renderer.canvas.height * 0.5);

	for (let index = 0; index < MAP_DATA.length; index++) {
		context.save();
		context.translate(grid.column(index) * 64, grid.row(index) * 64);

		const tile = MAP_DATA[index];
		RENDER[RENDER_TYPE.SPRITE](TILE_DATA[tile]);

		context.restore();
	}

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		// not good
		context.save();
		context.translate(entity.position[0], entity.position[1]);
		context.rotate(entity.angle);

		RENDER[entity.render_type](entity);

		context.restore();
	}
};
