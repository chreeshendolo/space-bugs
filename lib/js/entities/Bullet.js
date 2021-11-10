"use strict";

const Bullet = (function () {

	function Bullet() {

		this.faction_type = FACTION_TYPE.ENEMY;

		this.entity_type = ENTITY_TYPE.PROJECTILE;
		this.collision_mask = ENTITY_TYPE.CREATURE | ENTITY_TYPE.PARASITE;

		this.position = vec2.create();
		this.velocity = vec2.create();
		this.angle = 0;

		this.radius = 5;
		this.width = this.radius * 2;
		this.height = this.radius * 2;

		this.speed = 9;

		this.control_type = CONTROL_TYPE.PROJECTILE;

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "bullet";

		this.remove = false;

		this.effects = [];
	}

	return Bullet;
})();
