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

	const point = vec2.subtract(player.position, entity.position);
	entity.angle = vec2.angle(point);

	if (entity.effects.indexOf(entity.primary_action) < 0) {
		entity.effects.push(entity.primary_action);
	}

	if (entity.destination === undefined) {
		const rectangle = {position: entity.position, width: entity.vision_width, height: entity.vision_height};
		const indexes = grid.indexesInRectangle(rectangle);

		const goal = indexes.indexOf(grid.positionIndex(player.position));

		if (goal < 0) { return; }

		const start = indexes.indexOf(grid.positionIndex(entity.position));

		const path = pathfinding.getPath(
			start,
			goal,
			indexes,
			grid.getRectangleColumns(rectangle),
		);

		if (path.length < 1) { return; }

		const index = path.pop();

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

};
