"use strict";

const Gunner = (function () {

	function Gunner(index) {

		this.faction_type = FACTION_TYPE.ENEMY;

		this.entity_type = ENTITY_TYPE.CREATURE;
		this.collision_mask = ENTITY_TYPE.PARASITE;

		this.position = grid.indexPosition(index);
		this.velocity = vec2.create();
		this.angle = 0;

		this.radius = 16;
		this.width = this.radius * 2;
		this.height = this.radius * 2;

		this.speed = 3;

		this.control_type = CONTROL_TYPE.AI;

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "gunner";

		this.remove = false;

		this.primary_action = EFFECT_TYPE.SHOOT;

		this.effects = [];
	}

	return Gunner;
})();
