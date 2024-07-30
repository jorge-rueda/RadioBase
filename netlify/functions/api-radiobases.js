const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event) => {
    const { searchTerm } = event.queryStringParameters || {};
    const cacheKey = searchTerm || 'all';
    let cache = {}; // Consider implementing a more sophisticated cache strategy

    // Cache is usually not effective in serverless functions
    // Consider using a proper caching solution like Redis

    if (cache[cacheKey]) {
        return {
            statusCode: 200,
            body: JSON.stringify(cache[cacheKey]),
            headers: {
                'Access-Control-Allow-Origin': 'https://radiobase.netlify.app/.netlify/functions/api-rediobases', // Change '*' to your domain in production
            },
        };
    }

    let results;

    try {
        await client.connect();
        const database = client.db('radiobase');
        const collection = database.collection('radiobases');

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

        // Store the results in cache (note: this cache is in-memory and won't persist)
        cache[cacheKey] = results;

    } catch (err) {
        console.error('Database error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
            headers: {
                'Access-Control-Allow-Origin': 'https://radiobase.netlify.app/.netlify/functions/api-rediobases',
            },
        };
    } finally {
        try {
            await client.close();
        } catch (err) {
            console.error('Error closing connection:', err);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(results),
        headers: {
            'Access-Control-Allow-Origin': 'https://radiobase.netlify.app/.netlify/functions/api-rediobases', 
        },
    };
};
