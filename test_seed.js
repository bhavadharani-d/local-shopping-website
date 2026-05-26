async function seed() {
  try {
    const response = await fetch('http://localhost:1337/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: 'Seed Test',
          price: 99.99,
          stock: 10,
          category: 'Test',
          description: 'Test description',
          publishedAt: new Date()
        }
      })
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

seed();
