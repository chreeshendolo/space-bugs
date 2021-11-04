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

	context.imageSmoothingEnabled = false;
};

renderer.drawImage = function (image, position) {
	const context = this.context;

	context.drawImage(image, position[0], position[1]);
};

renderer.clearScreen = function (width, height) {
	const context = this.context;

	context.clearRect(0, 0, width, height);
};
