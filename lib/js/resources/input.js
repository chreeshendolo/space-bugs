"use strict";

const input = {};

input.mouse = {
	position: vec2.create(),
	down: false,
};

input.keys = {};

input.initialize = function () {
	document.addEventListener("keydown", input.onKeyDown.bind(input));
	document.addEventListener("keyup", input.onKeyUp.bind(input));
	document.addEventListener("mousemove", input.onMouseMove.bind(input));
	document.addEventListener("mousedown", input.onMouseDown.bind(input));
	document.addEventListener("mouseup", input.onMouseUp.bind(input));
};

input.onKeyDown = function (e) {
	e.preventDefault();

	this.keys[e.key] = true;
};

input.onKeyUp = function (e) {
	e.preventDefault();

	this.keys[e.key] = false;
};

input.onMouseDown = function (e) {
	this.onMouseMove(e);

	this.mouse.down = true;
};

input.onMouseUp = function (e) {
	this.onMouseMove(e);

	this.mouse.down = false;
};

input.onMouseMove = function (e) {
	this.mouse.position[0] = e.offsetX;
	this.mouse.position[1] = e.offsetY;
};
