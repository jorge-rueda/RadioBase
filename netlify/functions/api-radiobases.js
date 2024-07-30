const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'radiobase'; // Default to 'radiobase' if not provided
const collectionName = 'radiobase'; // Default collection name

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;
let collection;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbName);
      collection = db.collection(collectionName);
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw new Error('Database connection error');
    }
  }
}

exports.handler = async function(event, context) {
  try {
    await connectToDatabase();
    const documents = await collection.find({}).limit(100).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(documents),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching data' }),
    };
  }
};
