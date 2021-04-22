"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "store",

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
		 * Find order by orderId
		 *
		 * @param {Number} orderId - The order's unique identifier
		 */
         getOrder: {
			rest: "/order/:orderId",
            params: {
                orderId: { type: "string" }
            },
			/** @param {Context} ctx  */
			async handler(ctx) {
                const orderId = parseInt(ctx.params.orderId);
                if (!this.orders.has(orderId)) {
                    ctx.meta.$statusCode = 404;
                    ctx.meta.$statusMessage = 'Order with id ' + orderId + ' not found';
                    return;
                }
				return this.orders.get(orderId);
			}
        },

		/**
		 * Place an order for a pet
		 *
		 * @param order - pet order
		 */
		placeOrder: {
			rest: "POST /order",
            params: {
                order: {
                    $$type: "object",
                    id: { type: 'number', positive: true, integer: true },
                    petId: { type: 'number', positive: true, integer: true },
                    quantity: { type: 'number', positive: true, integer: true },
                    shipDate: { type: 'string' },
                    status: { type: 'enum', values: ['placed', 'approved', 'delivered']},
                    complete: { type: 'boolean' }
                }
            },
			/** @param {Context} ctx  */
			async handler(ctx) {
                const order = ctx.params.order;
                this.broker.call('pet.getPet', {petId: order.petId})
                    .then(this.orders.set(order.id, order))
                    .catch(error => console.error(error.message));
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
        this.orders = new Map();
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