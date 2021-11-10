"use strict";

const displace = {};

displace.circleRectangle = function (circle, rectangle) {
	const nearest = intersect.nearestPointRectangle(circle.position, rectangle);

	const displacement = vec2.subtract(circle.position, nearest);
	vec2.normalize(displacement, displacement);
	vec2.scale(displacement, circle.radius, displacement);

	vec2.add(nearest, displacement, circle.position);

};
