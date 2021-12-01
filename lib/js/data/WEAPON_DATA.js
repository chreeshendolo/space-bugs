"use strict";

const WEAPON_DATA = {};

WEAPON_DATA[WEAPON_TYPE.LUNGE] = {
	reload_duration: 5000,
	projectile_speed: 10,
};

WEAPON_DATA[WEAPON_TYPE.PISTOL] = {
	damage: 500,
	reload_duration: 800,
	projectile_speed: 6,
	sprite: "bullet_pistol",
};

WEAPON_DATA[WEAPON_TYPE.SNIPER] = {
	damage: 1000,
	reload_duration: 1200,
	projectile_speed: 10,
	sprite: "bullet_sniper",
};

WEAPON_DATA[WEAPON_TYPE.GUNNER] = {
	damage: 250,
	reload_duration: 400,
	projectile_speed: 4,
	sprite: "bullet_gunner",
};
