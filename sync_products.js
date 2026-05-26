
const productsToSeed = [
  // Cakes
  { name: 'Red Velvet Delight', price: 599, category: 'Cakes', description: 'Classic red velvet with cream cheese frosting.', stock: 15 },
  { name: 'Blueberry Cheesecake', price: 650, category: 'Cakes', description: 'Creamy cheesecake topped with fresh blueberries.', stock: 10 },
  { name: 'Black Forest Classic', price: 499, category: 'Cakes', description: 'Layers of chocolate sponge, cherries, and whipped cream.', stock: 20 },
  { name: 'Pineapple Paradise', price: 450, category: 'Cakes', description: 'Tropical pineapple cake with juicy bits.', stock: 12 },
  { name: 'Truflle Indulgence', price: 750, category: 'Cakes', description: 'Rich dark chocolate truffle cake.', stock: 8 },
  { name: 'Mango Mousse Cake', price: 550, category: 'Cakes', description: 'Light and airy seasonal mango mousse.', stock: 5 },
  { name: 'Vanilla Bean Cake', price: 399, category: 'Cakes', description: 'Classic madagascar vanilla bean sponge.', stock: 30 },
  { name: 'Butterscotch Crunch', price: 480, category: 'Cakes', description: 'Crunchy butterscotch bits and praline.', stock: 18 },
  { name: 'Strawberry Shortcake', price: 520, category: 'Cakes', description: 'Fresh strawberries and light whipped cream.', stock: 14 },
  { name: 'Opera Cake', price: 899, category: 'Cakes', description: 'French pastry with coffee and chocolate layers.', stock: 6 },

  // Burgers
  { name: 'Classic Veggie Burger', price: 120, category: 'Burgers', description: 'Potato and corn patty with lettuce.', stock: 50 },
  { name: 'Crispy Paneer Burger', price: 180, category: 'Burgers', description: 'Spicy breaded paneer block with mayo.', stock: 25 },
  { name: 'Big Cheese Burger', price: 150, category: 'Burgers', description: 'Double cheese slice with veggie patty.', stock: 40 },
  { name: 'Mushroom Swiss Burger', price: 190, category: 'Burgers', description: 'Sautéed mushrooms and melting Swiss cheese.', stock: 15 },
  { name: 'Sweet Potato Burger', price: 140, category: 'Burgers', description: 'Healthy sweet potato patty with avocado.', stock: 20 },

  // Pizzas
  { name: 'Margherita Gold', price: 299, category: 'Pizza', description: 'Fresh basil and double mozzarella.', stock: 35 },
  { name: 'Paneer Tikka Pizza', price: 399, category: 'Pizza', description: 'Indian spices and marinated cottage cheese.', stock: 25 },
  { name: 'Farmhouse Special', price: 450, category: 'Pizza', description: 'Onion, capsicum, mushroom, and tomato.', stock: 20 },
  { name: 'Spicy Jalapeno Pizza', price: 350, category: 'Pizza', description: 'Hot jalapenos and spicy red paprika.', stock: 30 },
  { name: 'Garden Veggie Pizza', price: 320, category: 'Pizza', description: 'Olives, corn, and assorted bell peppers.', stock: 28 },

  // Drinks
  { name: 'Cold Coffee Classic', price: 90, category: 'Drinks', description: 'Freshly brewed and chilled.', stock: 100 },
  { name: 'Mango Lassi', price: 70, category: 'Drinks', description: 'Traditional yogurt drink with mango.', stock: 80 },
  { name: 'Fresh Lime Soda', price: 50, category: 'Drinks', description: 'Zesty and refreshing.', stock: 150 },
  { name: 'Iced Peach Tea', price: 80, category: 'Drinks', description: 'Sweet and aromatic peach infusion.', stock: 90 },
  { name: 'Chocolate Milkshake', price: 120, category: 'Drinks', description: 'Thick and creamy cocoa delight.', stock: 60 },
  { name: 'Strawberry Smoothie', price: 140, category: 'Drinks', description: 'Blended fresh strawberries and greek yogurt.', stock: 40 },
  { name: 'Virgin Mojito', price: 110, category: 'Drinks', description: 'Mint, lime, and sparkling soda.', stock: 70 },
  { name: 'Orange Juice', price: 95, category: 'Drinks', description: '100% freshly squeezed oranges.', stock: 50 },
  { name: 'Hot Cocoa', price: 85, category: 'Drinks', description: 'Warm and comforting chocolate.', stock: 45 },
  { name: 'Masala Chai', price: 40, category: 'Drinks', description: 'Traditional spiced indian tea.', stock: 200 },

  // Snacks & Sides
  { name: 'French Fries', price: 80, category: 'Snacks', description: 'Golden and crispy salted fries.', stock: 120 },
  { name: 'Peri Peri Fries', price: 100, category: 'Snacks', description: 'Spicy african bird eye chili dusting.', stock: 100 },
  { name: 'Garlic Breadsticks', price: 110, category: 'Snacks', description: 'Buttery and garlic-infused sticks.', stock: 85 },
  { name: 'Cheese Nachos', price: 150, category: 'Snacks', description: 'With spicy salsa and melting cheese.', stock: 60 },
  { name: 'Vegetable Momos', price: 120, category: 'Snacks', description: 'Steamed dumplings with veggie filling.', stock: 55 },
  { name: 'Onion Rings', price: 90, category: 'Snacks', description: 'Beer-battered and deep fried.', stock: 75 },
  { name: 'Samosa Duo', price: 50, category: 'Snacks', description: 'Two crispy pyramid pastries.', stock: 150 },
  { name: 'Spring Rolls', price: 130, category: 'Snacks', description: 'Thai style veggie rolls.', stock: 45 },
  { name: 'Potato Wedges', price: 95, category: 'Snacks', description: 'Seasoned potato skins.', stock: 80 },
  { name: 'Chilli Paneer Dry', price: 210, category: 'Snacks', description: 'Indo-chinese cottage cheese bite.', stock: 35 },

  // Desserts
  { name: 'Gulab Jamun', price: 60, category: 'Desserts', description: 'Sweet syrup-soaked milk solids.', stock: 100 },
  { name: 'Dark Choco Brownie', price: 120, category: 'Desserts', description: 'Fudgy and chewy chocolate bar.', stock: 40 },
  { name: 'Apple Pie', price: 180, category: 'Desserts', description: 'Cinnamon spiced apple filling.', stock: 15 },
  { name: 'Fruit Salad', price: 150, category: 'Desserts', description: 'Fresh seasonal fruit medley.', stock: 25 },
  { name: 'Vanilla Ice Cream', price: 50, category: 'Desserts', description: 'Classic eggless scoop.', stock: 100 },
  { name: 'Chocolate Lava Cake', price: 160, category: 'Desserts', description: 'Molten center chocolate cake.', stock: 20 },
  { name: 'Tiramisu Cup', price: 220, category: 'Desserts', description: 'Italian coffee-flavored treat.', stock: 12 },
  { name: 'Rasmalai Delight', price: 80, category: 'Desserts', description: 'Soft cottage cheese in saffron milk.', stock: 50 },
  { name: 'Baklava Plate', price: 250, category: 'Desserts', description: 'Honey-soaked filo pastry with nuts.', stock: 18 },
  { name: 'Creme Brulee', price: 280, category: 'Desserts', description: 'Custard with burnt sugar topping.', stock: 10 },
];

async function syncProducts() {
  console.log('Fetching existing products...');
  let existingProducts = [];
  try {
    const response = await fetch('http://localhost:1337/api/products?pagination[limit]=500');
    if (response.ok) {
      const result = await response.json();
      existingProducts = result.data || [];
      console.log(`Found ${existingProducts.length} existing products.`);
    } else {
      console.error('Failed to fetch existing products. Status:', response.status);
      return;
    }
  } catch (err) {
    console.error('Error fetching products:', err.message);
    return;
  }

  const existingNames = new Set(existingProducts.map(p => p.name));
  const missingProducts = productsToSeed.filter(p => !existingNames.has(p.name));

  if (missingProducts.length === 0) {
    console.log('All products already exist. No action needed.');
    return;
  }

  console.log(`Adding ${missingProducts.length} missing products...`);

  for (const item of missingProducts) {
    try {
      const response = await fetch('http://localhost:1337/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...item,
            available: true,
            publishedAt: new Date()
          }
        })
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${item.name}`);
      } else {
        const error = await response.json();
        console.error(`❌ Failed to add: ${item.name}`, JSON.stringify(error));
      }
    } catch (err) {
      console.error(`💥 Error at ${item.name}:`, err.message);
    }
  }

  console.log('Sync complete!');
}

syncProducts();
