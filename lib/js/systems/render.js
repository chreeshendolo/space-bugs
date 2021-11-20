"use strict";

// @chris: where should this go?
const vertexIndices = grid.getVertexIndices(MAP_DATA);
const wallSegments = grid.getWallSegments(MAP_DATA);

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

	// start here

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

	// end here

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

		function getIntersectionPoint(ray, segment, smallestR) {
			const [A, B] = segment;
			const [C, D] = ray;
		
			const denominator = (D.x - C.x) * (B.y - A.y) - (B.x - A.x) * (D.y - C.y);
		
			const r = ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / denominator;
			if(r < 0) return null;
			if(smallestR !== null && smallestR < r) return null;
		
			const s = ((A.x - C.x) * (D.y - C.y) - (D.x - C.x) * (A.y - C.y)) / denominator;
			if(s < 0 || s > 1) return null;
		
			return { x: s * (B.x - A.x) + A.x, y: s * (B.y - A.y) + A.y, r };
		}

		function getClosestIntersectionPoint(ray, segments) {
			return segments.reduce((closest, segment) => {
				return getIntersectionPoint(ray, segment, closest ? closest.r : null) || closest;
			}, null);
		}

		function getOffsettedRayPoint(ray, angle) {
			return {
				x: (ray[1].x - ray[0].x) * Math.cos(angle) - (ray[1].y - ray[0].y) * Math.sin(angle) + ray[0].x,
				y: (ray[1].y - ray[0].y) * Math.cos(angle) + (ray[1].x - ray[0].x) * Math.sin(angle) + ray[0].y,
			};
		}

		function sortIntersectionPointsByAngle(anchor, points) {
			return points.sort((P1, P2) => Math.atan2(P1.y - anchor.y, P1.x - anchor.x) - Math.atan2(P2.y - anchor.y, P2.x - anchor.x));
		}
		

		const drawPoint = function (point, color) {
			const context = renderer.context;

			context.fillStyle = color;
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
			}, "#f00");
		}

		context.lineWidth = 1;
		context.strokeStyle = '#00f';
		for (let i = 0; i < wallSegments.length; i++) {
			const [A, B] = wallSegments[i];
			const unit = grid.unit;

			context.beginPath();
			context.moveTo(A.x * unit, A.y * unit);
			context.lineTo(B.x * unit, B.y * unit);
			context.closePath();
			context.stroke();
		}

		context.lineWidth = 1;
		context.strokeStyle = "#fff";
		const rays = getRays();
		const lineSegments = wallSegments.map((coords) => {
			return [
				{x: coords[0].x * grid.unit, y: coords[0].y * grid.unit},
				{x: coords[1].x * grid.unit, y: coords[1].y * grid.unit},
			];
		});

		const intersects = [];
		for (let i = 0; i < rays.length; i++) {
			const ray = rays[i];

			const [C, D] = ray;

			const intersect = getClosestIntersectionPoint(ray, lineSegments);
			if (intersect === null) { continue; } // I can't figure out why intersect is null occasionally

			intersects.push(intersect);

			context.beginPath();
			context.moveTo(C.x, C.y);
			context.lineTo(intersect.x, intersect.y);
			context.closePath();
			context.stroke();
		}

		// draw visible area
		const vertices = vertexIndices.map((index) => {
			const coords = grid.indexPosition(index);
			return {
				x: coords[0] - (grid.unit * 0.5),
				y: coords[1] - (grid.unit * 0.5),
			};
		});
		const playerPos = {x: player.position[0], y: player.position[1]};
		const intersectionPoints = [];
		const extraIntersectionPoints = []; // Hold those points separately for better visualization
		vertices.forEach(vertex => {
			const extraOffsetPoint1 = getOffsettedRayPoint([playerPos, vertex], -0.00001);
			const extraOffsetPoint2 = getOffsettedRayPoint([playerPos, vertex], 0.00001);
			const closestPoint = getClosestIntersectionPoint([playerPos, vertex], lineSegments);
			const extraClosestPoint1 = getClosestIntersectionPoint([playerPos, extraOffsetPoint1], lineSegments);
			const extraClosestPoint2 = getClosestIntersectionPoint([playerPos, extraOffsetPoint2], lineSegments);
		
			if(closestPoint !== null) intersectionPoints.push(closestPoint);
			if(extraClosestPoint1 !== null) extraIntersectionPoints.push(extraClosestPoint1);
			if(extraClosestPoint2 !== null) extraIntersectionPoints.push(extraClosestPoint2);
		});
	
		const sortedIntersects = sortIntersectionPointsByAngle(playerPos, [...intersectionPoints, ...extraIntersectionPoints]);

		
		// const sortedIntersects = intersects.sort((intersectA, intersectB) => {
		// 	const angle1 = Math.atan2(intersectA.y - playerPos.y, intersectA.x - playerPos.x);
		// 	const angle2 = Math.atan2(intersectB.y - playerPos.y, intersectB.x - playerPos.x);

		// 	return angle1 - angle2;
		// });

		// Turn off the lights
		context.fillStyle = "#000";
		for (let i = 0; i < indexes.length; i++) {
			const index = indexes[i];
	
			const tile = MAP_DATA[index];
	
			if (tile === TILE_TYPE.FLOOR || tile === TILE_TYPE.VENT) {
				context.fillRect(
					grid.column(index) * grid.unit,
					grid.row(index) * grid.unit,
					grid.unit,
					grid.unit,
				);
			}
		}

		const flashlightDistance = 150;
		const flashlightArc = Math.PI / 3;
		const mousePos = {
			x: (input.mouse.position[0] - 479) + playerPos.x,
			y: (input.mouse.position[1] - 270) + playerPos.y,
		};

		context.save();
		context.beginPath();
		context.moveTo(playerPos.x, playerPos.y);
		context.arc(playerPos.x, playerPos.y, flashlightDistance, Math.atan2(mousePos.y - playerPos.y, mousePos.x - playerPos.x) - flashlightArc / 2, Math.atan2(mousePos.y - playerPos.y, mousePos.x - playerPos.x) + flashlightArc / 2);
		context.clip();

		context.fillStyle = "rgba(255, 0, 255, 1)";
		context.beginPath();
		context.moveTo(sortedIntersects[0].x, sortedIntersects[0].y);

		for (let i = 1; i < sortedIntersects.length; i++) {
			const point = sortedIntersects[i];
			context.lineTo(point.x, point.y);
		}

		context.lineTo(sortedIntersects[0].x, sortedIntersects[0].y);
		context.fill();

		context.restore();

		// draw intercepts
		for (let i = 0; i < sortedIntersects.length; i++) {
			const intersect = sortedIntersects[i];

			context.fontStyle = "20px serif";
			context.fillStyle = "#ff0";
			context.fillText(String(i), intersect.x, intersect.y);
		}
	})();

};

function getRays() {
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

function getIntersectionPoint(ray, segment, smallestR) {
	const [A, B] = segment;
	const [C, D] = ray;

	const denominator = (D.x - C.x) * (B.y - A.y) - (B.x - A.x) * (D.y - C.y);

	const r = ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / denominator;
	if(r < 0) return null;
	if(smallestR !== null && smallestR < r) return null;

	const s = ((A.x - C.x) * (D.y - C.y) - (D.x - C.x) * (A.y - C.y)) / denominator;
	if(s < 0 || s > 1) return null;

	return { x: s * (B.x - A.x) + A.x, y: s * (B.y - A.y) + A.y, r };
}

function getClosestIntersectionPoint(ray, segments) {
	return segments.reduce((closest, segment) => {
		return getIntersectionPoint(ray, segment, closest ? closest.r : null) || closest;
	}, null);
}

function getOffsettedRayPoint(ray, angle) {
	return {
		x: (ray[1].x - ray[0].x) * Math.cos(angle) - (ray[1].y - ray[0].y) * Math.sin(angle) + ray[0].x,
		y: (ray[1].y - ray[0].y) * Math.cos(angle) + (ray[1].x - ray[0].x) * Math.sin(angle) + ray[0].y,
	};
}

function sortIntersectionPointsByAngle(anchor, points) {
	return points.sort((P1, P2) => Math.atan2(P1.y - anchor.y, P1.x - anchor.x) - Math.atan2(P2.y - anchor.y, P2.x - anchor.x));
}


function drawPoint(point, color) {
	const context = renderer.context;

	context.fillStyle = color;
	context.beginPath();
	context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
	context.fill();
};