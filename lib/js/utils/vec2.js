"use strict";

const vec2 = {};

vec2.create = function () {
	return [0, 0];
};

vec2.clone = function (v2) {
	return [v2[0], v2[1]];
};

vec2.copy = function (v2, out) {
	out[0] = v2[0];
	out[1] = v2[1];
	return out;
};

vec2.add = function (v1, v2) {
	const result = [];

	result[0] = v1[0] + v2[0];
	result[1] = v1[1] + v2[1];

	return result;
};
