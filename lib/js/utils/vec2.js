"use strict";

const vec2 = {};

vec2.create = function (x = 0, y = 0) {
	return [x, y];
};

vec2.copy = function (v2, out = []) {
	out[0] = v2[0];
	out[1] = v2[1];
	return out;
};

vec2.add = function (v2a, v2b, out = []) {
	out[0] = v2a[0] + v2b[0];
	out[1] = v2a[1] + v2b[1];
	return out;
};

vec2.subtract = function (v2a, v2b, out = []) {
	out[0] = v2a[0] - v2b[0];
	out[1] = v2a[1] - v2b[1];
	return out;
};

vec2.scale = function (v2, scalar, out = []) {
	out[0] = v2[0] * scalar;
	out[1] = v2[1] * scalar;
	return out;
};

vec2.angle = function (v2) {
	return Math.atan2(v2[1], v2[0]);
};

vec2.angleToVec2 = function (angle, out = []) {
	out[0] = Math.cos(angle);
	out[1] = Math.sin(angle);
	return out;
};

vec2.distance = function (v2a, v2b) {
	const distance = this.subtract(v2b, v2a);
	return this.magnitude(distance);
};

vec2.normalize = function (v2, out = []) {
	const magnitude = this.magnitude(v2);
	out[0] = magnitude === 0 ? 0 : v2[0] / magnitude;
	out[1] = magnitude === 0 ? 0 : v2[1] / magnitude;
	return out;
};

vec2.dot = function (v2a, v2b) {
	return v2a[0] * v2b[0] + v2a[1] * v2b[1];
};

vec2.magnitude = function (v2) {
	return Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
};

vec2.greaterThan = function (v2a, v2b) {
	return (v2a[0] * v2a[0] + v2a[1] * v2a[1]) > (v2b[0] * v2b[0] + v2b[1] * v2b[1]);
};

vec2.lessThan = function (v2a, v2b) {
	return (v2a[0] * v2a[0] + v2a[1] * v2a[1]) < (v2b[0] * v2b[0] + v2b[1] * v2b[1]);
};

vec2.equalTo = function (v2a, v2b) {
	return (v2a[0] * v2a[0] + v2a[1] * v2a[1]) === (v2b[0] * v2b[0] + v2b[1] * v2b[1]);
};
