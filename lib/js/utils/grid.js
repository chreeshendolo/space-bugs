"use strict";

const grid = {};

grid.unit = 64;
grid.columns = 32;

grid.column = function (index) {
	return index % this.columns;
};

grid.row = function (index) {
	return Math.floor(index / this.columns);
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

grid.indexesInRectangle = function (rectangle) {
	const position = rectangle.position;

	const right = Math.floor((position[0] + rectangle.width * 0.5) / this.unit);
	const bottom = Math.floor((position[1] + rectangle.height * 0.5) / this.unit);
	const left = Math.floor((position[0] - rectangle.width * 0.5) / this.unit);
	const top = Math.floor((position[1] - rectangle.height * 0.5) / this.unit);

	const indexes = [];
	for (let column = left; column <= right; column++) {
		for (let row = top; row <= bottom; row++) {
			const index = this.index(column, row);
			if (!this.valid(index)) { continue; }
			indexes.push(this.index(column, row));
		}
	}

	return indexes;
};

grid.valid = function (index) {
	return index >= 0 && index < MAP_DATA.length;
};
