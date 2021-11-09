"use strict";

const grid = {};

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
