const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');
const { parse, format } = require('date-fns'); 

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'alberto1443',
    database: 'radiobase'
});

// Conectar a la base de datos
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MySQL...');
});

// Función para convertir la fecha del formato 'dd/MM/yyyy' al formato 'yyyy-MM-dd'
function convertDate(dateStr) {
    try {
        const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
        return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
        console.error('Error al convertir la fecha:', error);
        return null;
    }
}

// Leer y procesar el archivo CSV
fs.createReadStream('data.csv')
    .pipe(csv({ headers: false })) 
    .on('data', (row) => {
        const name = row[0]; 
        const traffic_value = row[1]; 
        const traffic_date = convertDate(row[2]);

        if (traffic_date) { 
            const query = 'INSERT INTO radiobases (name, traffic_value, traffic_date) VALUES (?, ?, ?)';
            db.query(query, [name, traffic_value, traffic_date], (err, result) => {
                if (err) throw err;
                console.log('Datos insertados:', result);
            });
        }
    })
    .on('end', () => {
        console.log('Archivo CSV procesado con éxito');
        db.end(); 
    });
