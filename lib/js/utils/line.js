"use strict";

function bresenhamLine(pointA, pointB) {

	const steep = Math.abs(pointB[1] - pointA[1]) > Math.abs(pointB[0] - pointA[0]);

	{
		let swap;

		if (steep) {
			swap = pointA[0];
			pointA[0] = pointA[1];
			pointA[1] = swap;

			swap = pointB[0];
			pointB[0] = pointB[1];
			pointB[1] = swap;
		}

		if (pointA[0] > pointB[0]) {
			swap = pointA[0];
			pointA[0] = pointB[0];
			pointB[0] = swap;

			swap = pointA[1];
			pointA[1] = pointB[1];
			pointB[1] = swap;
		}
	}

	const deltaX = pointB[0] - pointA[0];
	const deltaY = Math.abs(pointB[1] - pointA[1]);

	let error = 0;

	let stepY;

	let y = pointA[1];

	if (pointA[1] < pointB[1]) {
		stepY = 1;
	} else {
		stepY = -1;
	}

	const points = [];
	for (let x = pointA[0]; x <= pointB[0]; x++) {
		if (steep) {
			points.push([y, x]);
		} else {
			points.push([x, y]);
		}

		error += deltaY;

		if (2 * error >= deltaX) {
			y += stepY;
			error -= deltaX;
		}
	}

	return points;
}
