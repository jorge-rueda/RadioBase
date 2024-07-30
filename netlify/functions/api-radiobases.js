const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // Asegúrate de que MONGO_URI esté configurado correctamente
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;
let collection;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('radiobase'); // Reemplaza con el nombre de tu base de datos
      collection = db.collection('radiobase'); // Reemplaza con el nombre de tu colección
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
