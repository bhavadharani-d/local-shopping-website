/**
 * order controller
 */
/* import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::order.order'); */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const tokenNumber = Math.floor(1000 + Math.random() * 9000);

        if (!ctx.request.body.data) {
            ctx.request.body.data = {};
        }

        // Using 'order_status' to match your Strapi setup
        ctx.request.body.data.token = tokenNumber;
        ctx.request.body.data.order_status = 'Order Received';

        const response = await super.create(ctx);

        const { items } = ctx.request.body.data;

        if (items && Array.isArray(items)) {
            for (const item of items) {
                const product = await strapi.entityService.findOne('api::product.product', item.id);
                if (product) {
                    const newStock = Math.max(0, product.stock - item.quantity);
                    await strapi.entityService.update('api::product.product', item.id, {
                        data: { stock: newStock }
                    });
                }
            }
        }

        return response;
    }
}));

