const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'mongodb+srv://root:alberto1443@radiobase.crdmddx.mongodb.net/?retryWrites=true&w=majority&appName=radiobase',
    user: 'root',
    password: 'alberto1443',
    database: 'radiobase'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Caché en memoria para optimizar busqueda
const cache = {};


app.get('/api/radiobases', (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    const cacheKey = searchTerm || 'all';

    // Verifica si los resultados están en el caché
    if (cache[cacheKey]) {
        return res.json(cache[cacheKey]);
    }

    // Consulta SQL
    const query = `
        SELECT name, traffic_value, traffic_date 
        FROM radiobases 
        WHERE name LIKE ?
        ORDER BY name, traffic_date;
    `;

    db.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) throw err;

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
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
