const rayCasting = {};

rayCasting.getRays = function (player) {
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

rayCasting.getIntersectionPoint = function (ray, segment, smallestR) {
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

rayCasting.getClosestIntersectionPoint = function (ray, segments) {
	return segments.reduce((closest, segment) => {
		return this.getIntersectionPoint(ray, segment, closest ? closest.r : null) || closest;
	}, null);
}

rayCasting.getOffsettedRayPoint = function (ray, angle) {
	return {
		x: (ray[1].x - ray[0].x) * Math.cos(angle) - (ray[1].y - ray[0].y) * Math.sin(angle) + ray[0].x,
		y: (ray[1].y - ray[0].y) * Math.cos(angle) + (ray[1].x - ray[0].x) * Math.sin(angle) + ray[0].y,
	};
}

rayCasting.sortIntersectionPointsByAngle = function (anchor, points) {
	return points.sort((P1, P2) => Math.atan2(P1.y - anchor.y, P1.x - anchor.x) - Math.atan2(P2.y - anchor.y, P2.x - anchor.x));
}

// get all vertex or "corner" points. stored as map tile indices
// whose upper-left point is a corner.
rayCasting.getVertexIndices = function (map) {
	const indices = [];

	const up = -this.columns;
	const left = -1;
	
	for (let i = 0; i < map.length; i++) {
		// continue if any of the tiles surrounding the point are out of bounds
		if (i + up < 0 || i + left < 0 || i + up + left < 0) { continue; }

		// build an array of tile values that surround the point
		const tiles = [map[i], map[i + up], map[i + left], map[i + up + left]];

		// find the amount of walls and non-walls surrounding the point
		const walls = tiles.filter(tile => tile === TILE_TYPE.WALL).length;
		const nonWalls = tiles.length - walls;

		// check whether we have three of one and one of the other, and add
		// point to array of indices if so
		if (Math.abs(walls - nonWalls) === 2) {
			indices.push(i);
		}
	}

	return indices;
};

rayCasting.getWallSegments = function (map) {
	const segments = [];
	const currentSegment = [];

	// get horizontal segments
	for (let i = 0; i < map.length; i++) {
		// continue if this tile and below tile are both walls or both floors
		const isWall = map[i] === TILE_TYPE.WALL;
		const belowIsWall = map[i + grid.columns] === TILE_TYPE.WALL;
		const belowIsUndefined = map[i + grid.columns] === undefined;
		if (isWall === belowIsWall || belowIsUndefined) {
			// push to segments array and empty current array if we had an ongoing array
			if (currentSegment.length > 0) {
				currentSegment.push(i);

				segments.push([
					{x: grid.column(currentSegment[0]), y: grid.row(currentSegment[0]) + 1},
					{x: grid.column(currentSegment[currentSegment.length - 1]), y: grid.row(currentSegment[currentSegment.length - 1]) + 1},
				]);

				currentSegment.length = 0;
			}

			continue;
		}

		currentSegment.push(i);
	}

	// get vertical segments
	for (let x = 0; x < grid.columns; x++) {
		for (let y = 0; y < grid.rows; y++) {
			const i = grid.index(x, y);

			// continue if this tile and below tile are both walls or both floors
			const isWall = map[i] === TILE_TYPE.WALL;
			const rightIsWall = map[i + 1] === TILE_TYPE.WALL;
			const rightIsUndefined = map[i + 1] === undefined;
			if (isWall === rightIsWall || rightIsUndefined) {
				// push to segments array and empty current array if we had an ongoing array
				if (currentSegment.length > 0) {
					currentSegment.push(i);

					segments.push([
						{x: grid.column(currentSegment[0] + 1), y: grid.row(currentSegment[0])},
						{x: grid.column(currentSegment[currentSegment.length - 1] + 1), y: grid.row(currentSegment[currentSegment.length - 1])},
					]);

					currentSegment.length = 0;
				}

				continue;
			}

			currentSegment.push(i);
		}
	}

	return segments;
};
