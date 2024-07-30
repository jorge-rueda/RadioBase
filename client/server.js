const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS y middleware
app.use(cors({
    origin: 'https://tu-dominio-en-netlify.netlify.app'  
}));
app.use(bodyParser.json());

// Conexión a MongoDB
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'radiobase';
let db;

client.connect(err => {
    if (err) throw err;
    console.log('MongoDB Connected...');
    db = client.db(dbName);
});

// Caché en memoria para optimizar búsqueda
const cache = {};

app.get('/api/radiobases', async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    const cacheKey = searchTerm || 'all';

    // Verifica si los resultados están en el caché
    if (cache[cacheKey]) {
        return res.json(cache[cacheKey]);
    }

    try {
        const collection = db.collection('radiobases');
        const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};
        const results = await collection.find(query).sort({ name: 1, traffic_date: 1 }).toArray();

        const data = results.reduce((acc, row) => {
            const { name, traffic_value, traffic_date } = row;
            if (!acc[name]) acc[name] = { name, traffic: {} };
            acc[name].traffic[traffic_date] = traffic_value;
            return acc;
        }, {});

        const resultArray = Object.values(data);

        // Almacena los resultados en caché
        cache[cacheKey] = resultArray;
        res.json(resultArray);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
