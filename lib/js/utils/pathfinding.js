"use strict";

const pathfinding = {};

pathfinding.directions = [
	grid.right,
	grid.down,
	grid.left,
	grid.up,
	grid.downRight,
	grid.downLeft,
	grid.upLeft,
	grid.upRight,
];

pathfinding.score = function (index, goal, indexes) {
	const a = [grid.column(index), grid.row(index)];
	const b = [grid.column(goal), grid.row(goal)];

	const c = vec2.subtract(a, b, b);

	return c[0] * c[0] + c[1] * c[1];
};

pathfinding.validNeighbor = function (index, neighbor, indexes) {

	if (neighbor < 0 || neighbor >= indexes.length) { return -1; }

	const originColumn = grid.column(origin);
	const neighborColumn =  grid.column(neighbor);
	if (originColumn === 0 && neighborColumn === columns - 1) { return -1; }
	if (neighborColumn === 0 && originColumn === columns - 1) { return -1; }

	return MAP_DATA[indexes[neighbor]] === 0 ? neighbor : -1;
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

			if (!this.validNeighbor(index, neighbor, indexes)) { continue; }

			const score = scores[index] + this.score(index, goal, indexes);
			const _score = scores[neighbor];

			const scored = _score === undefined;
			if (!scored || score < _score) {
				scores[neighbor] = _score;
				previous[neighbor] = index;
			}

			if (scored) { continue; }
			open.push(neighbor);

		}

		if (index === goal) {
			const path = [goal];
			let _index = goal;
			while (previous[_index] !== undefined) {
				path.push(indexes[previous[_index]]);
				_index = previous[_index];
			}

			return path;
		}

		if (open.length < 1) { return []; }

	}

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
