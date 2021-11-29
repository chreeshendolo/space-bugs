"use strict";

const DEBUG = false;
let debug_count = 0;
// @chris: where should this go?
const vertexIndices = rayCasting.getVertexIndices(MAP_DATA);
const wallSegments = rayCasting.getWallSegments(MAP_DATA);

const visionDistance = 500;
const visionArc = Math.PI / 3;

function render(entities) {
	const player = entities.filter((entity) => entity.player)[0];

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
	const rays = rayCasting.getRays(player);
	const lineSegments = wallSegments.map((coords) => {
		return [
			{x: coords[0].x * grid.unit, y: coords[0].y * grid.unit},
			{x: coords[1].x * grid.unit, y: coords[1].y * grid.unit},
		];
	});

	const intersects = [];
	for (let i = 0; i < rays.length; i++) {
		const ray = rays[i];

		const intersect = rayCasting.getClosestIntersectionPoint(ray, lineSegments);
		if (intersect === null) { continue; } // I can't figure out why intersect is null occasionally

		intersects.push(intersect);
	}

	const vertices = vertexIndices.map((index) => {
		const coords = grid.indexPosition(index);
		return {
			x: coords[0] - (grid.unit * 0.5),
			y: coords[1] - (grid.unit * 0.5),
		};
	});
	const playerPos = {x: player.position[0], y: player.position[1]};
	const intersectionPoints = [];
	const extraIntersectionPoints = [];

	for (let i = 0; i < vertices.length; i++) {
		const vertex = vertices[i];

		const extraOffsetPoint1 = rayCasting.getOffsettedRayPoint([playerPos, vertex], -0.00001);
		const extraOffsetPoint2 = rayCasting.getOffsettedRayPoint([playerPos, vertex], 0.00001);
		const closestPoint = rayCasting.getClosestIntersectionPoint([playerPos, vertex], lineSegments);
		const extraClosestPoint1 = rayCasting.getClosestIntersectionPoint([playerPos, extraOffsetPoint1], lineSegments);
		const extraClosestPoint2 = rayCasting.getClosestIntersectionPoint([playerPos, extraOffsetPoint2], lineSegments);

		if (closestPoint !== null) { intersectionPoints.push(closestPoint); }
		if (extraClosestPoint1 !== null) { extraIntersectionPoints.push(extraClosestPoint1); }
		if (extraClosestPoint2 !== null) { extraIntersectionPoints.push(extraClosestPoint2); }
	}

	const sortedIntersects = rayCasting.sortIntersectionPointsByAngle(playerPos, [...intersectionPoints, ...extraIntersectionPoints]);

	const clipping = false;

	if (clipping) {
		// Turn off the lights
		context.save();
		context.fillStyle = "#000";
		context.fillRect(playerPos.x - renderer.canvas.width * 0.5, playerPos.y - renderer.canvas.height * 0.5, renderer.canvas.width, renderer.canvas.height);
		context.restore();

		const mousePos = {
			x: (input.mouse.position[0] - 479) + playerPos.x,
			y: (input.mouse.position[1] - 270) + playerPos.y,
		};

		context.save();
		context.beginPath();
		context.moveTo(playerPos.x, playerPos.y);
		context.arc(
			playerPos.x,
			playerPos.y,
			player.vision_radius,
			0,
			Math.PI * 2,
		);
		context.clip();

		context.beginPath();
		context.moveTo(sortedIntersects[0].x, sortedIntersects[0].y);

		for (let i = 1; i < sortedIntersects.length; i++) {
			const point = sortedIntersects[i];
			context.lineTo(point.x, point.y);
		}

		context.lineTo(sortedIntersects[0].x, sortedIntersects[0].y);
		context.clip();
	}

	for (let i = 0; i < indexes.length; i++) {
		const index = indexes[i];

		const tile = MAP_DATA[index];
		const image = images.get(TILE_DATA[tile].sprite);

		if (tile === TILE_TYPE.WALL) { continue; }

		context.drawImage(image, grid.column(index) * 64, grid.row(index) * 64);

		if (!DEBUG) { continue; }

		context.fillStyle = "#888";
		context.fillText(String(index), grid.column(index) * 64 + 24, grid.row(index) * 64 + 38);
	}

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.render_type === undefined) { continue; }

		RENDERS[entity.render_type](entity);

		for (let ii = 0; ii < entity.effects.length; ii++) {
			RENDERS[EFFECT_DATA[entity.effects[ii]].render_type](entity);
		}
	}

	context.restore();

	for (let i = 0; i < indexes.length; i++) {
		const index = indexes[i];

		const tile = MAP_DATA[index];

		if (tile !== TILE_TYPE.WALL) { continue; }
		if (!rayCasting.isIndexInLineOfSight(player.position, index, indexes)) { continue; }

		let total = 0;
		for (let ii = 0; ii < 8; ii++) {
			const direction = 1 << ii;

			const neighbor = grid.neighbor(index, direction);
			if (tile !== MAP_DATA[neighbor]) { continue; }

			total += direction;
		}

		const tile_data = TILE_DATA[1][total];
		const image = images.get(tile_data.sprite);

		context.save();
		context.translate(grid.column(index) * 64 + 32, grid.row(index) * 64 + 32);
		context.rotate(tile_data.rotation)

		context.drawImage(image, -32, -32, 64, 64);
		context.restore();

		if (DEBUG) {
			context.fillStyle = "#888";
			context.fillText(String(index), grid.column(index) * 64 + 24, grid.row(index) * 64 + 38);
		}
	}

	if (!DEBUG) { return; }

	context.lineWidth = 1;

	// draw wall line segments
	context.strokeStyle = "#00f";
	for (let i = 0; i < lineSegments.length; i++) {
		const [A, B] = lineSegments[i];

		context.beginPath();
		context.moveTo(A.x, A.y);
		context.lineTo(B.x, B.y);
		context.closePath();
		context.stroke();
	}

	// draw rays
	context.strokeStyle = "#fff";
	for (let i = 0; i < rays.length; i++) {
		const [A, B] = rays[i];

		context.beginPath();
		context.moveTo(A.x, A.y);
		context.lineTo(B.x, B.y);
		context.closePath();
		context.stroke();
	}

	// draw intersects
	for (let i = 0; i < sortedIntersects.length; i++) {
		const intersect = sortedIntersects[i];

		context.fillStyle = "#f0f";
		context.fillRect(intersect.x - 5, intersect.y - 5, 12, 12);

		context.fillStyle = "#fff";
		context.fillText(String(i), intersect.x - 5, intersect.y + 4);
	}
};
