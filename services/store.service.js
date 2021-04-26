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

        getInventory: {
            rest: '/inventory',
            async handler(ctx) {
                return this.inventory;
            }
        },

		/**
		 * Find order by orderId
		 *
		 * @param {Number} orderId - The order's unique identifier
		 */
         getOrder: {
			rest: "/order/:orderId",
            params: {
                orderId: { type: "string", positive: true, integer: true }
            },
			/** @param {Context} ctx  */
			async handler(ctx) {
                const orderId = parseInt(ctx.params.orderId);
                this.logger.info('Fetching order with orderId ' + orderId);
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
                id: { type: 'number', positive: true, integer: true },
                petId: { type: 'number', positive: true, integer: true },
                quantity: { type: 'number', positive: true, integer: true },
                shipDate: { type: 'date', convert:true },
                status: { type: 'enum', values: ['placed', 'approved', 'delivered']},
                complete: { type: 'boolean' }
            },
			/** @param {Context} ctx  */
			async handler(ctx) {
                const order = ctx.params;
                this.logger.info('Placing order ' + JSON.stringify(order));
                this.broker.call('pet.getPet', {petId: order.petId.toString()})
                    .then(this.orders.set(order.id, order))
                    .catch(error => this.logger.error('pet.getPet failed: ' + error.message));
			}
		}
	},

	/**
	 * Events
	 */
	events: {
        'pet.created': {
            handler(ctx) {
                this.logger.info('Pet created ' + JSON.stringify(ctx.params));
                const pet = ctx.params;
                if (pet.status === 'available') {
                    this.logger.info('Adding default inventory of 10');
                    this.inventory.set(ctx.params.petId, 10);
                }
            }
        }
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
        this.inventory = new Map(); //map of petid to inventory for available pets
        this.inventory.set(123, 10);
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
