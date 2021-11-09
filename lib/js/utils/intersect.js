"use strict";

const intersect = {};

intersect.circlePoint = function (circle, point) {
	const deltaX = circle.position[0] - point[0];
	const deltaY = circle.position[1] - point[1];

	return (deltaX * deltaX + deltaY * deltaY) < (circle.radius * circle.radius);
};

intersect.circleCircle = function (circleA, circleB) {
	const total = circleA.radius + circleB.radius;

	const deltaX = circleA.position[0] - circleB.position[0];
	const deltaY = circleA.position[1] - circleB.position[1];

	return (deltaX * deltaX + deltaY * deltaY) < (total * total);
};

intersect.circleRectangle = function (circle, rectangle) {
	return this.circlePoint(circle, this.nearestPointRectangle(circle.position, rectangle));
};

intersect.nearestPointRectangle = function (point, rectangle) {
	return [
		Math.max(rectangle.position[0] - rectangle.width * 0.5, Math.min(point[0], rectangle.position[0] + rectangle.width * 0.5)),
		Math.max(rectangle.position[1] - rectangle.height * 0.5, Math.min(point[1], rectangle.position[1] + rectangle.height * 0.5)),
	];
};
