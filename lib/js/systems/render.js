"use strict";

// @chris: where should this go?
const vertexIndices = grid.getVertexIndices(MAP_DATA);

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

		context.fillStyle = "#888";
		context.fillText(String(index), grid.column(index) * 64 + 24, grid.row(index) * 64 + 38);
	}

	let player;
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.render_type === undefined) { continue; }

		if (entity.player) { player = entity; }

		RENDERS[entity.render_type](entity);

		for (let ii = 0; ii < entity.effects.length; ii++) {
			RENDERS[EFFECT_DATA[entity.effects[ii]].render_type](entity);
		}

	}

	(function () {
		const getRays = function () {
			const lineSegments = [];
			const playerPos = {x: player.position[0], y: player.position[1]};

			for (let i = 0; i < vertexIndices.length; i++) {
				const index = vertexIndices[i];
				const coords = grid.indexPosition(index);

				lineSegments.push([
					playerPos,
					{x: coords[0] - (grid.unit * 0.5), y: coords[1] - (grid.unit * 0.5)},
				]);
			}

			return lineSegments;
		};

		const drawPoint = function (point) {
			const context = renderer.context;

			context.fillStyle = 'red';
			context.beginPath();
			context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
			context.fill();
		};

		for (let i = 0; i < vertexIndices.length; i++) {
			const index = vertexIndices[i];
			const coords = grid.indexPosition(index);

			drawPoint({
				x: coords[0] - (grid.unit * 0.5),
				y: coords[1] - (grid.unit * 0.5),
			});
		}

		context.lineWidth = 1;
		context.strokeStyle = '#FFF';
		const rays = getRays();
		for (let i = 0; i < rays.length; i++) {
			const ray = rays[i];

			const [A, B] = ray;

			const distance = Math.sqrt(((A.x - B.x) ** 2) + ((A.y - B.y) ** 2));
			if (distance > 500) { continue; }

			context.beginPath();
			context.moveTo(A.x, A.y);
			context.lineTo(B.x, B.y);
			context.closePath();
			context.stroke();

			// const [C, D] = ray;

			// const denominator = (D.x - C.x) * (B.y - A.y) - (B.x - A.x) * (D.y - C.y);
			
			// const s = ((A.x - C.x) * (D.y - C.y) - (D.x - C.x) * (A.y - C.y)) / denominator;
			// if (s < 0 || s > 1) { continue; }
			
			// const r = ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / denominator;
			// if (r < 0) { continue; }
			
			// const intersect = { x: s * (B.x - A.x) + A.x, y: s * (B.y - A.y) + A.y };
						
			// drawIntersectionPoint(intersect);
		}
	})();

};
