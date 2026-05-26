const ORDER_STATUS = {
  RECEIVED: 'Received',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COLLECTED: 'Collected',
};

const PRODUCT_UID = 'api::product.product';
const ORDER_UID = 'api::order.order';
const SHOP_UID = 'api::shop.shop';

async function getNextTokenNumber() {
  const latestOrders = await strapi.db.query(ORDER_UID).findMany({
    select: ['tokenNumber'],
    orderBy: { tokenNumber: 'desc' },
    limit: 1,
  });

  const latestToken = latestOrders?.[0]?.tokenNumber;
  return Number.isInteger(latestToken) ? latestToken + 1 : 1001;
}

async function getProductSnapshots(items) {
  const productIds = items.map((item) => item.id).filter(Boolean);

  if (productIds.length === 0) {
    return [];
  }

  return strapi.db.query(PRODUCT_UID).findMany({
    where: { id: { $in: productIds } },
    select: ['id', 'name', 'stock', 'available', 'price', 'costPrice'],
  });
}

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (!data.tokenNumber) {
      data.tokenNumber = await getNextTokenNumber();
    }

    data.status = data.status || ORDER_STATUS.RECEIVED;

    if (!data.shop && !data.shopName) {
      throw new Error('Please select a pickup shop.');
    }

    const shopWhere = data.shop
      ? { id: data.shop }
      : { name: data.shopName };

    const shop = await strapi.db.query(SHOP_UID).findOne({
      where: shopWhere,
      select: ['id', 'name', 'isActive'],
    });

    if (!shop || shop.isActive === false) {
      throw new Error('Selected pickup shop is unavailable.');
    }

    data.shop = shop.id;
    data.shopName = shop.name;

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('Order must include at least one item.');
    }

    const products = await getProductSnapshots(data.items);
    const productMap = new Map(products.map((product) => [product.id, product]));

    let totalCost = 0;

    data.items.forEach((item) => {
      const product = productMap.get(item.id);

      if (!product) {
        throw new Error(`Product not found for item ${item.name}.`);
      }

      if (!product.available || product.stock < item.quantity) {
        throw new Error(`${product.name} is out of stock for the requested quantity.`);
      }

      const unitCost = Number(product.costPrice || product.price * 0.6 || 0);
      totalCost += unitCost * item.quantity;
    });

    data.totalCost = totalCost;
    data.totalProfit = Number(data.totalAmount || 0) - totalCost;
  },

  async afterCreate(event) {
    const { result } = event;
    const items = result?.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return;
    }

    const products = await getProductSnapshots(items);
    const productMap = new Map(products.map((product) => [product.id, product]));

    await Promise.all(
      items.map(async (item) => {
        const product = productMap.get(item.id);

        if (!product) {
          return;
        }

        const newStock = Math.max(0, product.stock - item.quantity);

        await strapi.db.query(PRODUCT_UID).update({
          where: { id: product.id },
          data: {
            stock: newStock,
            available: newStock > 0,
          },
        });
      })
    );
  },
};
