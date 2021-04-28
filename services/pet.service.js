"use strict";

const { requestTimeout } = require('../moleculer.config');
const { MoleculerRetryableError } = require("moleculer").Errors;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
//TODO circuit breaker behaviour will go here 
module.exports = {
	name: "pet",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Find pet by petId
		 *
		 * @param {Number} petId - The pet's unique identifier
		 */
		getPet: {
			rest: "/:petId",
			/** @param {Context} ctx  */
			async handler(ctx) {
                const petId = parseInt(ctx.params.petId);
                console.log(`>>> Get Pet request, received. petId=${petId}`);
				setTimeout(() => {console.log("Pretending to be BUSY")},5000)
				if (!this.pets.has(petId)) {
					console.log("pet not found, simulating a Retryable error...")
					return this.Promise.reject(new MoleculerRetryableError("retry!"));
                //     ctx.meta.$statusCode = 404;
                //     ctx.meta.$statusMessage = 'Pet with id ' + petId + ' not found';
                //     return;
                }
				return this.pets.get(petId);
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
        this.pets = new Map();
        this.pets.set(123, {id: 123, name: 'Fido'});
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
