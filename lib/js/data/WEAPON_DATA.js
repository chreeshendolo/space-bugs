"use strict";

const WEAPON_DATA = {};

WEAPON_DATA[WEAPON_TYPE.LUNGE] = {
	reload_duration: 5000,
	projectile_speed: 10,
};

WEAPON_DATA[WEAPON_TYPE.PISTOL] = {
	damage: 250,
	reload_duration: 1000,
	projectile_speed: 9,
};

WEAPON_DATA[WEAPON_TYPE.SNIPER] = {
	damage: 1000,
	reload_duration: 5000,
	projectile_speed: 12,
};
