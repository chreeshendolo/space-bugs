"use strict";

const grid = {};

grid.unit = 64;
grid.columns = 32;
grid.rows = 33;

grid.positionCoordinates = function (position) {
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
	if (column < 0 || column >= this.columns) { return -1; }
	if (row < 0 || row >= MAP_DATA.length) { return -1; }
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

grid.lineOfSight = function (pointA, pointB) {

	const x_inc = (pointB[0] > pointA[0]) ? 1 : -1;
	const y_inc = (pointB[1] > pointA[1]) ? 1 : -1;

	let x = pointA[0];
	let y = pointA[1];

	let dx = Math.abs(pointB[0] - x);
	let dy = Math.abs(pointB[1] - y);

	let n = 1 + dx + dy

	let error = dx - dy;

	dx *= 2;
	dy *= 2;

	const path = [];
	for (; n > 0; --n) {
		path.push(this.index(x, y));
		if (MAP_DATA[this.index(x, y)] !== 0) { return false; }

		if (error > 0) {
			x += x_inc;
			error -= dy;
		} else if (error < 0) {
			y += y_inc;
			error += dx;
		} else {
			if (MAP_DATA[this.index(x + x_inc, y)] !== 0 || MAP_DATA[this.index(x, y + y_inc)] !== 0) { return false; };

			x += x_inc;
			error -= dy;

			y += y_inc;
			error += dx;

			n--;
		}
	}

	return true;
};

grid.getIndexVerticies = function (index) {
	const x = this.column(index) * this.unit;
	const y = this.row(index) * this.unit;
	return [
		[x, y],
		[x + this.unit, y],
		[x + this.unit, y + this.unit],
		[x, y + this.unit],
	];
};

grid.neighbor = function (index, direction) {
	const x = this.column(index);
	const y = this.row(index);
	switch (direction) {
		case DIRECTION.E: {
			return this.index(x + 1, y);
		}
		case DIRECTION.S: {
			return this.index(x, y + 1);
		}
		case DIRECTION.W: {
			return this.index(x - 1, y);
		}
		case DIRECTION.N: {
			return this.index(x, y - 1);
		}
		case DIRECTION.SE: {
			return this.index(x + 1, y + 1);
		}
		case DIRECTION.SW: {
			return this.index(x - 1, y + 1);
		}
		case DIRECTION.NW: {
			return this.index(x - 1, y - 1);
		}
		case DIRECTION.NE: {
			return this.index(x + 1, y - 1);
		}
		default: return -1;
	}
};
