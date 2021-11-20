"use strict";

const grid = {};

grid.unit = 64;
grid.columns = 32;
grid.rows = 33;

grid.positionCoord = function (position) {
	return [
		Math.floor(position[0] / this.unit),
		Math.floor(position[1] / this.unit),
	];
};

grid.column = function (index, columns) {
	if (columns === undefined) {
		columns = this.columns;
	}
	return index % columns;
};

grid.row = function (index, columns) {
	if (columns === undefined) {
		columns = this.columns;
	}
	return Math.floor(index / columns);
};

grid.index = function (column, row) {
	return row * this.columns + column;
};

grid.right = function (index, columns) {
	return index + 1;
};

grid.down = function (index, columns) {
	return index + columns;
};

grid.left = function (index, columns) {
	return index - 1;
};

grid.up = function (index, columns) {
	return index - columns;
};

grid.downRight = function (index, columns) {
	return index + columns + 1;
};

grid.downLeft = function (index, columns) {
	return index + columns - 1;
};

grid.upLeft = function (index, columns) {
	return index - columns - 1;
};

grid.upRight = function (index, columns) {
	return index - columns + 1;
};

grid.positionIndex = function (position) {
	const column = Math.floor(position[0] / this.unit);
	const row = Math.floor(position[1] / this.unit);

	return this.index(column, row);
};

grid.indexPosition = function (index) {
	return vec2.create(
		this.column(index) * this.unit + this.unit * 0.5,
		this.row(index) * this.unit + this.unit * 0.5,
	);
};

grid.rectangle = function (index) {
	return {
		position: this.indexPosition(index),
		width: this.unit,
		height: this.unit,
	};
};

grid.circle = function (index) {
	return {
		position: this.indexPosition(index),
		radius: this.unit * 0.5,
	};
};

grid.getRectangleColumns = function (rectangle) {
	const position = rectangle.position;
	const right = Math.floor((position[0] + rectangle.width * 0.5) / this.unit);
	const left = Math.floor((position[0] - rectangle.width * 0.5) / this.unit);

	return right - left + 1;
};

grid.indexesInRectangle = function (rectangle) {
	const position = rectangle.position;

	const right = Math.floor((position[0] + rectangle.width * 0.5) / this.unit);
	const bottom = Math.floor((position[1] + rectangle.height * 0.5) / this.unit);
	const left = Math.floor((position[0] - rectangle.width * 0.5) / this.unit);
	const top = Math.floor((position[1] - rectangle.height * 0.5) / this.unit);

	const columns = right - left + 1;
	const rows = bottom - top + 1;

	const total = columns * rows;

	const indexes = [];
	for (let i = 0; i < total; i++) {
		const index = this.index(left + i % columns, top + Math.floor(i / columns));
		if (!this.valid(index)) { continue; }
		indexes.push(index);
	}

	return indexes;
};

grid.valid = function (index) {
	return index >= 0 && index < MAP_DATA.length;
};

// get all vertex or "corner" points. stored as map tile indices
// whose upper-left point is a corner.
// @chris: should this go here?
grid.getVertexIndices = function (map) {
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

grid.getWallSegments = function (map) {
	const segments = [];
	const currentSegment = [];

	// get horizontal segments
	for (let i = 0; i < map.length; i++) {
		// continue if this tile and below tile are both walls or both floors
		const isWall = map[i] === TILE_TYPE.WALL;
		const belowIsWall = map[i + this.columns] === TILE_TYPE.WALL;
		const belowIsUndefined = map[i + this.columns] === undefined;
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
	for (let x = 0; x < this.columns; x++) {
		for (let y = 0; y < this.rows; y++) {
			const i = this.index(x, y);

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
