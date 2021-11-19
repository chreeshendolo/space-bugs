"use strict";

const AI_SCRIPTS = {};

AI_SCRIPTS[AI_STATE.IDLE] = function (entity) {
	let player = undefined;
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.player !== true) { continue; }
		player = entity;
	}

	if (player === undefined) { return; }

	const inVision = intersect.circleCircle({
			position: entity.position,
			radius: entity.vision_radius,
		},
		player,
	);

	if (!inVision) { return; };

	const angle = vec2.angleToVec2(entity.angle);
	vec2.scale(angle, player.radius, angle);

	const position = vec2.add(player.position, angle);

	if (vec2.dot(
		vec2.subtract(entity.position, position, position),
		angle,
	) > 0) { return; }

	entity.ai_state = AI_STATE.ENGAGED;
};

AI_SCRIPTS[AI_STATE.ENGAGED] = function (entity) {
	let player = undefined;
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.player !== true) { continue; }
		player = entity;
	}

	if (player === undefined) { return; }

	const direction = vec2.subtract(player.position, entity.position);

	entity.angle = vec2.angle(direction);

	if (entity.effects.indexOf(entity.primary_action) < 0) {
		entity.effects.push(entity.primary_action);
	}

	const distance = vec2.magnitude(direction);

	const engaged_radius = entity.vision_radius * 1.5;

	let lineOfSight = true;
	{
		const points = line(
			grid.positionCoord(entity.position),
			grid.positionCoord(player.position),
		);

		// console.log(JSON.stringify({
		// 	entity: grid.positionCoord(entity.position),
		// 	player: grid.positionCoord(player.position),
		// 	points,
		// }))

		for (let i = 0; i < points.length; i++) {
			const point = points[i];
			const index = grid.index(point[0], point[1]);
			if (MAP_DATA[index] === 0) { continue; }
			lineOfSight = false;
			break;
		}
	}
	// console.log("LOS: " + lineOfSight)

	if (distance > engaged_radius) { // disengage

		entity.destination = undefined;
		entity.ai_state = AI_STATE.IDLE;
		return;
	} else if (!lineOfSight || distance > engaged_radius * 0.6) { // move closer

		if (lineOfSight) {

			entity.destination = undefined;
			vec2.normalize(direction, direction);
			vec2.scale(direction, entity.speed, entity.velocity);
			return;
		}

		if (entity.destination === undefined) {
			const rectangle = {position: entity.position, width: engaged_radius * 2, height: engaged_radius * 2};
			const indexes = grid.indexesInRectangle(rectangle);

			const goal = indexes.indexOf(grid.positionIndex(player.position));

			if (goal < 0) {
				// console.log("GOAL < 0")
				return;
			}

			const start = indexes.indexOf(grid.positionIndex(entity.position));

			const path = pathfinding.getPath(
				start,
				goal,
				indexes,
				grid.getRectangleColumns(rectangle),
			);

			// console.log("PATH:" + JSON.stringify(path))
			if (path.length < 1) { return; }

			const index = path.pop();
			// console.log("DEST:" + index)

			entity.destination = grid.indexPosition(index);

		} else {

			if (intersect.circlePoint(entity, entity.destination)) {
				entity.destination = undefined;
				return;
			}

			vec2.subtract(entity.destination, entity.position, entity.velocity);

			vec2.normalize(entity.velocity, entity.velocity);

			vec2.scale(entity.velocity, entity.speed, entity.velocity);
		}
	} else if (distance < engaged_radius * 0.4){ // move away

		vec2.normalize(direction, direction);
		vec2.scale(direction, -entity.speed, entity.velocity);
		entity.destination = undefined;

		return;
	} else {
		entity.destination = undefined;
		return;
	}

};
