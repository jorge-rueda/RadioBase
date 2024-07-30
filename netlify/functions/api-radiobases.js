const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event) => {
  const { searchTerm } = event.queryStringParameters || {};
  const cacheKey = searchTerm || 'all';
  const cache = {}; // Consider implementing a more sophisticated cache strategy

  // Verifica si los resultados están en el caché
  if (cache[cacheKey]) {
    return {
      statusCode: 200,
      body: JSON.stringify(cache[cacheKey]),
    };
  }

  let results;

  try {
    await client.connect();
    const database = client.db('radiobase');
    const collection = database.collection('radiobases');

    // Consulta MongoDB
    const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};
    const cursor = collection.find(query).sort({ name: 1, traffic_date: 1 });

    const docs = await cursor.toArray();
    results = docs.reduce((acc, doc) => {
      const { name, traffic_value, traffic_date } = doc;
      if (!acc[name]) acc[name] = { name, traffic: {} };
      acc[name].traffic[traffic_date] = traffic_value;
      return acc;
    }, {});

    results = Object.values(results);

    // Almacena los resultados en caché
    cache[cacheKey] = results;

  } catch (err) {
    console.error('Database error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
