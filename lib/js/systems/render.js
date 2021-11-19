"use strict";

function render(entities) {

	const context = renderer.context;
	context.resetTransform();
	context.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.player !== true) { continue; }

		vec2.copy(entity.position, camera.position);
		break;
	}

	context.translate(-camera.position[0] + renderer.canvas.width * 0.5, -camera.position[1] + renderer.canvas.height * 0.5);

	const indexes = grid.indexesInRectangle({position: camera.position, width: renderer.canvas.width, height: renderer.canvas.height});

	for (let i = 0; i < indexes.length; i++) {
		const index = indexes[i];

		const tile = MAP_DATA[index];
		const image = images.get(TILE_DATA[tile].sprite);

		context.drawImage(image, grid.column(index) * 64, grid.row(index) * 64);

		// context.fillStyle = "#888";
		// context.fillText(String(index), grid.column(index) * 64 + 24, grid.row(index) * 64 + 38);
	}

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.render_type === undefined) { continue; }

		RENDERS[entity.render_type](entity);

		for (let ii = 0; ii < entity.effects.length; ii++) {
			RENDERS[EFFECT_DATA[entity.effects[ii]].render_type](entity);
		}

	}

};
