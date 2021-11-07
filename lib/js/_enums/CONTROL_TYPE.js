"use strict";

// I don't like using `0` as an actual value since `0` is falsy
// @Bennett - I propose that we never rely on truthy/falsy comparisons, it limits us in things like 0, undefined, null, etc..
const CONTROL_TYPE = {
	NONE: 0,

	WASD: 1,
	MOUSE: 2,
};
