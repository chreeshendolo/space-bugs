"use strict";

const Signal = (function () {
	function Signal() {
		this.listeners = [];

		this.emit = function (...args) {
			for (let i = 0; i < this.listeners.length; i++) {
				const listener = this.listeners[i];
				listener(...args);
			}
		};

		this.recieve = function (callback) {
			this.listeners.push(callback);
		};
	};

	return Signal;
})();
