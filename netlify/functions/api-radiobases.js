const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;
let collection;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('radiobase'); // Nombre de la base de datos
      collection = db.collection('radiobase'); // Nombre de la colección
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw new Error('Database connection error');
    }
  }
}

exports.handler = async function(event, context) {
  try {
    await connectToDatabase();
    const documents = await collection.find({}).limit(1000).toArray(); // Ajusta el límite según sea necesario


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
