"use strict";

const EFFECT_DATA = {};

EFFECT_DATA[EFFECT_TYPE.HOST] = {
	duration: 5000,
	render_type: RENDER_TYPE.HOST,
};

EFFECT_DATA[EFFECT_TYPE.SHOOT] = {
	duration: 250,
	render_type: RENDER_TYPE.NONE,
};

EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND] = {
	duration: 1000,
	filter_frequency: 400,
	panning: {
		left: 0,
		right: 0,
	},
	render_type: RENDER_TYPE.NONE,
};

EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND] = {
	duration: 1000,
	filter_frequency: 22_000,
	panning: {
		left: -1,
		right: 1,
	},
	render_type: RENDER_TYPE.NONE,
};
