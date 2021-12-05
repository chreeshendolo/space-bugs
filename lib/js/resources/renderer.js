"use strict";

const BG_COLORS = ["#F00", "#0F0", "#00F", "#FF0"];

const renderer = {};

renderer.canvas = null;
renderer.context = null;

renderer.initialize = function (width, height) {
	const canvas = this.canvas = document.createElement("canvas");

	canvas.width = width;
	canvas.height = height;

	canvas.style.backgroundColor = "#F00";
	canvas.style.cursor = "crosshair";

	document.body.appendChild(canvas);

	const context = this.context = canvas.getContext("2d");

	context.imageSmoothingEnabled = true;

	music.onChordChange.recieve((chordIndex) => {
		canvas.style.backgroundColor = BG_COLORS[chordIndex];
	});
};
