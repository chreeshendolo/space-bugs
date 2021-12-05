"use strict";

const awards = {};

awards.sprite = "parasite";

awards.cache = {
	parasite: {locked: false, default: true},
	award_victory: {locked: true},
	award_mercy: {locked: true},
	award_justice: {locked: true},
	award_contagion: {locked: true},
};

awards.order = [
	"parasite",
	"award_victory",
	"award_mercy",
	"award_justice",
	"award_contagion",
];

awards.initialize = function () {

	const _awards = this.cache;

	for (const key in _awards) {
		const award = _awards[key];

		const value = localStorage.getItem(key);
		if (value === null) { continue; }

		const data = JSON.parse(value);
		if (data.locked) { continue; }

		award.locked = false;

		award.time = data.time;
		award.total = data.total;
	}
};

awards.save = function () {
	const _awards = this.cache;

	for (const key in _awards) {
		const award = _awards[key];

		localStorage.setItem(
			key,
			JSON.stringify({
				locked: award.locked,
				time: award.time,
				total: award.total,
			}),
		);

	}
};

awards.render = function () {
	const ctx = renderer.context;

	const canvas = renderer.canvas;

	const order = this.order;

	const size = 64;
	const baseX = canvas.width * 0.5 - order.length * size * 0.5 + size * 0.5;
	const y = canvas.height * 0.85;

	let isData = false;
	for (let i = 0; i < order.length; i++) {
		const key = order[i];

		const award = this.get(key);
		const image = images.get(award.locked ? "award_locked" : key);

		const x = baseX + i * size;

		ctx.save();

		ctx.translate(x, y);
		ctx.rotate(Math.PI * 1.5);

		ctx.drawImage(image, -32, -32);

		ctx.restore();

		if (award.locked || award.default) { continue; }

		isData = true;

		{
			const seconds = Math.floor(award.time / 1e3);
			const m = Math.floor(seconds / 60);
			const s = seconds % 60;
			const ms = Math.floor(award.time % 1e3)
			const timer = `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}:${ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : ms}`;
			const w = ctx.measureText(timer).width;
			ctx.fillStyle = award.new_time ? "#AA0" : "#AAA";
			ctx.fillText(timer, x - w * 0.5, y - 24);
		}

		{
			const total = award.total;
			const w = ctx.measureText(total).width;
			ctx.fillStyle = award.new_count ? "#AA0" : "#AAA";
			ctx.fillText(total, x - w * 0.5, y + 32);
		}
	}

	if (isData) {

		ctx.fillStyle = "#444";
		ctx.fillRect(8, canvas.height - 44, 80, 24);

		ctx.fillStyle = "#999";
		const text = "CLEAR DATA";
		const w = ctx.measureText(text).width;
		ctx.fillText(text, 16 + 32 - w * 0.5, canvas.height - 28);

	}


};

awards.select = function (position) {
	const canvas = renderer.canvas;

	const order = this.order;

	const size = 64;
	const baseX = canvas.width * 0.5 - order.length * size * 0.5 + size * 0.5;
	const y = canvas.height * 0.85;

	for (let i = 0; i < order.length; i++) {
		const key = order[i];

		const award = this.get(key);
		if (award.locked) { continue; }

		const x = baseX + i * size;

		if (!intersect.circlePoint({position: [x, y], radius: 16}, position)) { continue; }

		this.sprite = key;

		return;
	}

	const _x = position[0];
	const _y = position[1];
	if (
		_x >= 8 && _x <= 88
		&& _y >= canvas.height - 44 && _y <= canvas.height - 20
	) {
		localStorage.clear();

		this.sprite = "parasite";
		for (let i = 0; i < order.length; i++) {
			const key = order[i];

			const award = this.get(key);
			award.locked = true;

		}
	}

};

awards.get = function (key) {
	return this.cache[key];
};

awards.stale = function () {
	const _awards = this.cache;

	for (const key in _awards) {
		const award = _awards[key];

		award.new_time = false;
		award.new_count = false;

	}
};

awards.set = function (key, time) {
	const award = this.get(key);

	award.locked = false;
	award.total = (award.total === undefined ? 0 : award.total) + 1;
	award.new_count = true;

	if (time < (award.time === undefined ? Infinity : award.time)) {
		award.new_time = true;
		award.time = time;
	} else {
		award.new_time = false;
	}

};
