"use strict";

const EFFECT_DATA = {};

EFFECT_DATA[EFFECT_TYPE.HOST] = {
	render_type: RENDER_TYPE.HOST,
};

EFFECT_DATA[EFFECT_TYPE.SHOOT] = {
	render_type: RENDER_TYPE.NONE,
};

EFFECT_DATA[EFFECT_TYPE.MORTAL] = {
	render_type: RENDER_TYPE.MORTAL,
};

EFFECT_DATA[EFFECT_TYPE.RELOADING] = {
	render_type: RENDER_TYPE.RELOADING,
};

EFFECT_DATA[EFFECT_TYPE.LOUD] = {
	duration: 16,
	render_type: RENDER_TYPE.NONE,
};

EFFECT_DATA[EFFECT_TYPE.LUNGING] = {
	duration: 200,
	render_type: RENDER_TYPE.NONE,
};

EFFECT_DATA[EFFECT_TYPE.STUN] = {
	duration: 300,
	render_type: RENDER_TYPE.NONE,
};

// EFFECT_DATA[EFFECT_TYPE.DAMPEN_SOUND] = {
// 	duration: 1000,
// 	filter_frequency: 400,
// 	panning: {
// 		left: 0,
// 		right: 0,
// 	},
// 	render_type: RENDER_TYPE.NONE,
// };

// EFFECT_DATA[EFFECT_TYPE.HIGHTEN_SOUND] = {
// 	duration: 1000,
// 	filter_frequency: 22_000,
// 	panning: {
// 		left: -1,
// 		right: 1,
// 	},
// 	render_type: RENDER_TYPE.NONE,
// };
