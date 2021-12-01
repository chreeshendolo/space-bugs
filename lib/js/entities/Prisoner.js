"use strict";

const Prisoner = (function () {

	function Prisoner(index, angle) {
		this.free = false;

		this.faction_type = FACTION_TYPE.PLAYER;

		this.entity_type = ENTITY_TYPE.PRISONER;
		this.collision_mask = ENTITY_TYPE.CREATURE | ENTITY_TYPE.PARASITE;

		this.position = grid.indexPosition(index);
		this.velocity = vec2.create();
		this.angle = angle;

		this.radius = 34;
		this.width = this.radius * 2;
		this.height = this.radius * 2;

		this.speed = 0;

		this.control_type = CONTROL_TYPE.STUN;

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "parasite_prison";

		this.remove = false;

		this.effects = [];
		this.remove_effects = [];
	}

	return Prisoner;
})();
