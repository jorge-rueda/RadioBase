const { MongoClient } = require('mongodb');

// Usa las variables de entorno configuradas
const uri = process.env.MONGO_URI; 
const dbName = process.env.DB_NAME; // Si es necesario
const dbUser = process.env.DB_USER; // Si es necesario
const dbPassword = process.env.DB_PASSWORD; // Si es necesario

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;
let collection;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbName || 'radiobase'); // Usa DB_NAME si está disponible
      collection = db.collection('radiobase'); // O usa una variable si la colección puede cambiar
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
