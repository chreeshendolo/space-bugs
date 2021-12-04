"use strict";

const Pistol = (function () {

	function Pistol(index, angle) {

		this.max_health = 1000;
		this.health = this.max_health;

		this.vision_radius = 320;
		this.vision_width = this.vision_radius * 2;
		this.vision_height = this.vision_radius * 2;

		this.faction_type = FACTION_TYPE.ENEMY;

		this.entity_type = ENTITY_TYPE.CREATURE;
		this.collision_mask = ENTITY_TYPE.PARASITE;

		this.position = grid.indexPosition(index);
		this.velocity = vec2.create();
		this.angle = angle;

		this.radius = 32;
		this.width = this.radius * 2;
		this.height = this.radius * 2;

		this.speed = 3;

		this.control_type = CONTROL_TYPE.AI;
		this.ai_state = AI_STATE.IDLE;
		this.path = []; // places I still need to go
		this.destination = undefined; // where I'm going now

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "pistol";

		this.remove = false;

		this.primary_action = EFFECT_TYPE.SHOOT;
		this.weapon_type = WEAPON_TYPE.PISTOL;

		this.effects = [EFFECT_TYPE.MORTAL];
		this.add_effects = [];
		this.remove_effects = [];
	}

	return Pistol;
})();
