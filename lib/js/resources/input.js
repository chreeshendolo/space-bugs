"use strict";

const input = {};

input.interacted = false;

input.keys = {};

input.mouse = {
	position: vec2.create(),
	left: false,
};

input.preventDefaults = {
	ArrowRight: true,
	ArrowDown: true,
	ArrowUp: true,
	ArrowLeft: true,
};

input.preventDefault = function (e) {
	if (!this.preventDefaults[e.key]) { return; }
	e.preventDefault();
};

input.onKeyDown = function (e) {
	this.preventDefault(e);

	this.keys[e.key] = true;

	// this.interacted = true;
};

input.onKeyUp = function (e) {
	this.preventDefault(e);

	this.keys[e.key] = false;
};

input.onMouseDown = function (e) {
	this.preventDefault(e);

	this.mouse.left = true;

	this.interacted = true;
};

input.onMouseUp = function (e) {
	this.preventDefault(e);

	this.mouse.left = false;
};

input.onMouseMove = function (e) {
	this.preventDefault(e);

	this.mouse.position[0] = e.offsetX;
	this.mouse.position[1] = e.offsetY;
};

input.initialize = function () {
	document.addEventListener("keydown", input.onKeyDown.bind(input));
	document.addEventListener("keyup", input.onKeyUp.bind(input));
	document.addEventListener("mousemove", input.onMouseMove.bind(input));
	document.addEventListener("mousedown", input.onMouseDown.bind(input));
	document.addEventListener("mouseup", input.onMouseUp.bind(input));
};
