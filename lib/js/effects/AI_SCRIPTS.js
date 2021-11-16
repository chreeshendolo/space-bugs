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

	if (entity.effects.indexOf(entity.primary_action) >= 0) { return; }
	entity.effects.push(entity.primary_action);

	const indexes = grid.indexesInRectangle({position: entity.position, width: entity.vision_width, height: entity.vision_height});

	console.log(JSON.stringify({
		start: indexes.indexOf(grid.positionIndex(entity.position)),
		goal: indexes.indexOf(grid.positionIndex(player.position)),
		length: indexes.length,
		columns: Math.floor(entity.vision_width / 64) + 1,
	}))

	const path = pathfinding.getPath(
		indexes.indexOf(grid.positionIndex(entity.position)),
		indexes.indexOf(grid.positionIndex(player.position)),
		indexes,
		Math.floor(entity.vision_width / 64) + 1,
	);

	console.log(JSON.stringify(path))

};
