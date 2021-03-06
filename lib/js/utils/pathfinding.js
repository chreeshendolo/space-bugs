"use strict";

const pathfinding = {};

pathfinding.directions = [
	grid.right,
	grid.down,
	grid.left,
	grid.up,
	// grid.downRight,
	// grid.downLeft,
	// grid.upLeft,
	// grid.upRight,
];

pathfinding.score = function (index, goal, indexes, columns) {
	const a = [grid.column(index, columns), grid.row(index, columns)];
	const b = [grid.column(goal, columns), grid.row(goal, columns)];

	const c = vec2.subtract(a, b, b);

	const distance = c[0] * c[0] + c[1] * c[1];

	let nearWalls = 0;
	for (let i = 0; i < this.directions.length; i++) {
		const neighbor = this.directions[i](index, columns);

		if (MAP_DATA[indexes[neighbor]] === 0) { continue; }

		nearWalls += 30;
	}

	return distance + nearWalls;
};

pathfinding.validNeighbor = function (index, neighbor, indexes, columns) {

	if (neighbor < 0 || neighbor >= indexes.length) { return false; }

	const originColumn = grid.column(index, columns);
	const neighborColumn =  grid.column(neighbor, columns);
	if (originColumn === 0 && neighborColumn === columns - 1) { return false; }
	if (neighborColumn === 0 && originColumn === columns - 1) { return false; }

	return MAP_DATA[indexes[neighbor]] === 0;
};

pathfinding.getPath = function (start, goal, indexes, columns) {

	const open = [start];
	const scores = {[start]: 0};
	const previous = {};

	let iterations = 1000;
	while (iterations-- > 0) {
		open.sort(function (a, b) {
			const sA = scores[a] === undefined ? Infinity : scores[a];
			const sB = scores[b] === undefined ? Infinity : scores[b];
			return sB - sA;
		});

		const index = open.pop();

		for (let i = 0; i < this.directions.length; i++) {
			const neighbor = this.directions[i](index, columns);

			if (!this.validNeighbor(index, neighbor, indexes, columns)) { continue; }

			const score = scores[index] + this.score(neighbor, goal, indexes, columns);
			const _score = scores[neighbor];

			const scored = _score !== undefined;
			if (!scored || score < _score) {
				scores[neighbor] = score;
				previous[neighbor] = index;
			}

			if (scored) { continue; }
			open.push(neighbor);

		}

		if (index === goal) {
			const path = [];
			let _index = goal;
			while (_index !== start) {
				path.push(indexes[_index]);
				_index = previous[_index];
			}

			return path;
		}

		if (open.length < 1) { return []; }

	}

	return [];

};

// (function () {
// const map = [
// 	0, 0, 0, 0, 0,
// 	0, 0, 0, 0, 0,
// 	0, 0, 0, 0, 0,
// 	0, 0, 0, 0, 0,
// 	0, 0, 0, 0, 0,
// ];
//
// 	const columns = 5;
//
// 	const values = {
// 		0: 1,
// 		1: Infinity, // need to exclude impassible walls
// 	};
//
// 	const start = 0;
// 	const goal = 24;
//
// 	const open = [start];
// 	const scores = {[start]: 0};
// 	const previous = {};
//
// 	let iterations = 0;
// 	while (iterations++ < 1000) {
// 		open.sort((a, b) => {
// 			const sA = scores[a] === undefined ? Infinity : scores[a];
// 			const sB = scores[b] === undefined ? Infinity : scores[b];
// 			return sB - sA;
// 		});
//
// 		const index = open.pop();
//
// 		const neighbors = getNeighbors(index);
// 		for (let i = 0; i < neighbors.length; i++) {
// 			const neighbor = neighbors[i];
//
// 			const score = scores[index] + values[map[neighbor]];
// 			const _score = scores[neighbor];
//
// 			const scored = _score !== undefined;
// 			if (!scored || score < _score) {
// 				scores[neighbor] = score;
// 				previous[neighbor] = index;
// 			}
//
// 			if (scored) { continue; }
// 			open.push(neighbor);
//
// 		}
//
// 		if (index === goal) {
// 			const path = [goal];
// 			let _index = goal;
// 			while (previous[_index] !== undefined) {
// 				path.push(previous[_index]);
// 				_index = previous[_index];
// 			}
// 			console.log(path)
// 			break;
// 		}
// 		if (open.length < 1) {
// 			console.log("NAY")
// 			break;
// 		}
//
// 	}
//
// 	function getNeighbors(index) {
// 		const helpers = [
// 			R, D, L, U,
// 			// DR, DL, UL, UR,
// 		];
//
// 		const neighbors = [];
// 		for (let i = 0; i < helpers.length; i++) {
// 			const neighbor = helpers[i](index);
// 			if (neighbor < 0) { continue; }
// 			neighbors.push(neighbor);
// 		}
//
// 		return neighbors;
// 	}
//
// 	function R(index) {
// 		return validate(index, index + 1);
// 	}
//
// 	function DR(index) {
// 		return validate(index, index + columns + 1);
// 	}
//
// 	function D(index) {
// 		return validate(index, index + columns);
// 	}
//
// 	function DL(index) {
// 		return validate(index, index + columns - 1);
// 	}
//
// 	function L(index) {
// 		return validate(index, index - 1);
// 	}
//
// 	function UL(index) {
// 		return validate(index, index - columns - 1);
// 	}
//
// 	function U(index) {
// 		return validate(index, index - columns);
// 	}
//
// 	function UR(index) {
// 		return validate(index, index - columns + 1);
// 	}
//
// 	function validate(origin, neighbor) {
// 		const originColumn = getColumn(origin);
// 		const neighborColumn = getColumn(neighbor);
// 		if (originColumn === 0 && neighborColumn === columns - 1) { return -1; }
// 		if (neighborColumn === 0 && originColumn === columns - 1) { return -1; }
// 		return neighbor > -1 && neighbor < map.length ? neighbor : -1;
// 	}
//
// 	function getColumn(index) {
// 		return index % columns;
// 	}
//
// 	function getRow(index) {
// 		return Math.floor(index / columns);
// 	}
//
// })();
