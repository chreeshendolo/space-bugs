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

	const indexes = grid.indexesInRectangle({position: camera.position, width: renderer.canvas.width, height: renderer.canvas.height});

	for (let i = 0; i < indexes.length; i++) {
		const index = indexes[i];

		const tile = MAP_DATA[index];
		const image = images.get(TILE_DATA[tile].sprite);

		context.drawImage(image, grid.column(index) * 64, grid.row(index) * 64);
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
