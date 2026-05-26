import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. SET PERMISSIONS FOR PUBLIC ROLE
    // This allows the custom React admin panel to work without a complex auth system (for college project)
    try {
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const productPermissions = [
          { action: 'api::product.product.find', role: publicRole.id },
          { action: 'api::product.product.findOne', role: publicRole.id },
          { action: 'api::product.product.create', role: publicRole.id },
          { action: 'api::product.product.update', role: publicRole.id },
        ];

        const shopPermissions = [
          { action: 'api::shop.shop.find', role: publicRole.id },
          { action: 'api::shop.shop.findOne', role: publicRole.id },
        ];

        const orderPermissions = [
          { action: 'api::order.order.create', role: publicRole.id },
          { action: 'api::order.order.find', role: publicRole.id },
          { action: 'api::order.order.findOne', role: publicRole.id },
          { action: 'api::order.order.update', role: publicRole.id },
        ];

        const uploadPermissions = [
            { action: 'plugin::upload.content-api.upload', role: publicRole.id },
        ];

        const allPermissions = [...productPermissions, ...shopPermissions, ...orderPermissions, ...uploadPermissions];

        for (const permission of allPermissions) {
          const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: { action: permission.action, role: publicRole.id },
          });

          if (!exists) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: permission,
            });
            strapi.log.info(`Permission ${permission.action} granted to Public role`);
          }
        }
      }
    } catch (error) {
      strapi.log.error('Failed to set public permissions:', error);
    }

    // 2. SEED DEFAULT SHOPS
    try {
      const shopCount = await strapi.db.query('api::shop.shop').count();

      if (shopCount === 0) {
        strapi.log.info('Seeding default pickup shops...');

        const sampleShops = [
          {
            name: 'Smart Shop Central Store',
            address: 'Main Road, Town Center',
            phone: '9876543210',
            hours: '9:00 AM - 9:00 PM',
            prepNote: 'Best for quick pickup in 20 to 30 minutes',
            isActive: true,
          },
          {
            name: 'Smart Shop Lake View',
            address: 'Lake View Street, West Side',
            phone: '9876543211',
            hours: '10:00 AM - 8:30 PM',
            prepNote: 'Good for evening pickup orders',
            isActive: true,
          },
          {
            name: 'Smart Shop Market Point',
            address: 'Old Market Junction',
            phone: '9876543212',
            hours: '8:30 AM - 8:00 PM',
            prepNote: 'Closest for market area customers',
            isActive: true,
          },
        ];

        for (const shop of sampleShops) {
          await strapi.entityService.create('api::shop.shop', {
            data: {
              ...shop,
              publishedAt: new Date(),
            },
          });
        }

        strapi.log.info('Default pickup shops seeded successfully.');
      }
    } catch (error) {
      strapi.log.error('Failed to seed pickup shops:', error);
    }

    // 3. SEED SAMPLE PRODUCTS
    try {
      const productCount = await strapi.db.query('api::product.product').count();

      if (productCount === 0) {
        strapi.log.info('Seeding sample products...');
        
        const sampleProducts = [
          {
            name: 'Chocolate Cake',
            price: 459,
            stock: 10,
            available: true,
            category: 'Cakes',
            description: 'Delicious Choco-lava cake with rich fudge.'
          },
          {
            name: 'Jungle Joy Lion Cake',
            price: 1099,
            stock: 5,
            available: true,
            category: 'Specialty',
            description: 'A roar-some lion themed cake for kids!'
          },
          {
            name: 'Rich Chocolate Truffle',
            price: 459,
            stock: 7,
            available: true,
            category: 'Truffles',
            description: 'Pure chocolate bliss in every bite.'
          }
        ];

        for (const product of sampleProducts) {
          await strapi.entityService.create('api::product.product', {
            data: {
              ...product,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info('Sample products seeded successfully.');
      }
    } catch (error) {
      strapi.log.error('Failed to seed products:', error);
    }

    // 4. REGISTER GLOBAL LIFECYCLES FOR ORDERS
    strapi.db.lifecycles.subscribe({
      models: ['api::order.order'],
      
      async beforeCreate(event) {
        const { data } = event.params;
        
        try {
          const lastOrder = await strapi.db.query('api::order.order').findOne({
            orderBy: { tokenNumber: 'desc' },
            where: { tokenNumber: { $ne: null } }
          });

          const nextToken = lastOrder && lastOrder.tokenNumber ? lastOrder.tokenNumber + 1 : 6134;
          data.tokenNumber = nextToken;
          
          if (!data.status) {
            data.status = 'Received';
          }
          strapi.log.info(`Order Lifecycle: Generated tokenNumber #${data.tokenNumber}`);
        } catch (error) {
          strapi.log.error('Order Lifecycle Error (beforeCreate):', error);
        }
      },

      async afterCreate(event) {
        const { result } = event;
        const { items } = result;

        if (items && Array.isArray(items)) {
          for (const item of items) {
            const productId = item.productId || item.id;
            const quantity = item.quantity || 1;

            if (productId) {
              try {
                const product = await strapi.db.query('api::product.product').findOne({
                  where: { 
                    $or: [
                      { id: productId },
                      { documentId: productId }
                    ]
                  }
                });
                
                if (product) {
                  const newStock = Math.max(0, (product.stock || 0) - quantity);
                  await strapi.entityService.update('api::product.product', product.id, {
                    data: {
                      stock: newStock,
                      available: newStock > 0
                    },
                  });
                  strapi.log.info(`Order Lifecycle: Updated stock for product ${product.id} to ${newStock}`);
                }
              } catch (error) {
                strapi.log.error(`Order Lifecycle Error (afterCreate stock update): ${error.message}`);
              }
            }
          }
        }
      }
    });
  },
};
