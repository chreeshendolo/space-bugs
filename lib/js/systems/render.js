"use strict";

function render(entities) {
	const context = renderer.context;
	context.resetTransform();
	context.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		// not good
		context.save();
		context.translate(entity.position[0], entity.position[1]);
		context.rotate(entity.angle);

		RENDER[entity.type]();

		context.restore();
	}
};
