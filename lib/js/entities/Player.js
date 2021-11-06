"use strict";

const Creature = (function () {

	function Creature(source) {
		this.position = vec2.create();
		this.velocity = vec2.create();
		this.angle = 0;

		this.source = source;

		this.spriteKey = "player";
		this.render = "player";

		this.creatureType = CREATURE_TYPE.PLAYER;

		this.controlType = CONTROL_TYPE.AI;

		this.actions = [ACTION_SHOOT];

		this.weapon = WEAPONS.PISTOL;
	}

	return Creature;
})();
