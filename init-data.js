const http = require('http');

async function makeRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function initializeData() {
  console.log('🔧 Initializing MMA Platform data...\n');

  // Спочатку створимо вагові категорії через SQL (оскільки у нас немає GraphQL мутації для них)
  console.log('⚠️  Please run this SQL in your database first:');
  console.log(`
INSERT INTO weight_classes (name) VALUES 
    ('Flyweight'),
    ('Bantamweight'), 
    ('Featherweight'),
    ('Lightweight'),
    ('Welterweight'),
    ('Middleweight'),
    ('Light Heavyweight'),
    ('Heavyweight');
    `);

  console.log('\nThen run this script again to create test data.\n');

  // Тестуємо з'єднання
  try {
    const result = await makeRequest('query { __schema { types { name } } }');
    if (result.errors) {
      console.log('❌ GraphQL Error:', result.errors[0].message);
    } else {
      console.log('✅ GraphQL connection OK');
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

initializeData().catch(console.error);
