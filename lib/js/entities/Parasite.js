"use strict";

const Parasite = (function () {

	function Parasite(index) {

		this.player = true;

		this.faction_type = FACTION_TYPE.PLAYER;

		this.entity_type = ENTITY_TYPE.PARASITE;
		this.collision_mask = ENTITY_TYPE.CREATURE;

		this.position = grid.indexPosition(index);
		this.velocity = vec2.create();
		this.angle = 0;

		this.radius = 16;
		this.width = this.radius * 2;
		this.height = this.radius * 2;

		this.speed = 3;

		this.control_type = CONTROL_TYPE.KEYBOARD_AND_MOUSE;

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "player";

		this.remove = false;

		this.effects = [];
	}

	return Parasite;
})();
