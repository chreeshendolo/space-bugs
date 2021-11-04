"use strict";

const renderer = {};

renderer.canvas = null;
renderer.context = null;

renderer.initialize = function (width, height) {
	const canvas = this.canvas = document.createElement("canvas");

	canvas.width = width;
	canvas.height = height;

	canvas.style.backgroundColor = "#000";

	document.body.appendChild(canvas);

	const context = this.context = canvas.getContext("2d");

	context.imageSmoothingEnabled = true;
};
