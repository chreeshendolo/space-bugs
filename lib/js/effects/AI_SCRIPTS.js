"use strict";

const AI_SCRIPTS = {};

AI_SCRIPTS[AI_STATE.IDLE] = function (entity) {

	let player = undefined;
	let loud = [];
	for (let i = 0; i < entities.length; i++) {

		const _entity = entities[i];

		if (_entity.effects.indexOf(EFFECT_TYPE.LOUD) >= 0) {
			loud.push(_entity);
		}

		if (_entity.player !== true) { continue; }
		player = _entity;
	}

	if (player === undefined && loud.length < 1) { return; }

	if (loud.length > 0) {
		const loudest = loud.sort((a, b) => {
			return vec2.distance(entity.position, a.position) - vec2.distance(entity.position, b);
		})[0];

		const loudestInVision = intersect.circleCircle(
			{
				position: entity.position,
				radius: entity.vision_radius,
			},
			loudest,
		);

		if (loudestInVision) {
			const direction = vec2.subtract(player.position, entity.position);

			entity.angle = vec2.angle(direction);
		}

	}

	const playerInVision = intersect.circleCircle(
		{
			position: entity.position,
			radius: entity.vision_radius,
		},
		player,
	);

	if (!playerInVision) { return; };

	if (player.entity_type !== ENTITY_TYPE.PARASITE) {
		entity.ai_state = AI_STATE.ENGAGED;
		entity.effects.push(EFFECT_TYPE.STUN);
		return;
	}

	const angle = vec2.angleToVec2(entity.angle);
	vec2.scale(angle, player.radius, angle);

	const position = vec2.add(player.position, angle);

	if (vec2.dot(
		vec2.subtract(entity.position, position, position),
		angle,
	) > 0) { return; }

	// if (!grid.lineOfSight(
	// 	grid.positionCoordinates(entity.position),
	// 	grid.positionCoordinates(player.position),
	// )) { return; }

	const hasLineOfSight = rayCasting.hasLineOfSight(entity.position, player.position);
	if (!hasLineOfSight) { return; }

	entity.ai_state = AI_STATE.ENGAGED;
	entity.effects.push(EFFECT_TYPE.STUN);
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

	entity.effects.push(entity.primary_action);

	const distance = vec2.magnitude(direction);

	const engaged_radius = entity.vision_radius * 1.5;

	// const lineOfSight = grid.lineOfSight(
	// 	grid.positionCoordinates(entity.position),
	// 	grid.positionCoordinates(player.position),
	// );
	const lineOfSight = rayCasting.hasLineOfSight(entity.position, player.position);

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
				console.log("GOAL < 0")
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

			if (intersect.circlePoint({position: entity.position, radius: entity.radius * 0.5}, entity.destination)) {
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
