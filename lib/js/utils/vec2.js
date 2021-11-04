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
